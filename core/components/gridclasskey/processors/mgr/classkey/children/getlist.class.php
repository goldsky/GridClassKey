<?php

/**
 * GridClassKey
 *
 * Copyright 2013 - 2017 by goldsky <goldsky@virtudraft.com>
 *
 * This file is part of GridClassKey, a custom class key for MODX
 * Revolution's Manager to hide child resources inside container's grid.
 *
 * GridClassKey is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation version 3,
 *
 * GridClassKey is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * GridClassKey; if not, write to the Free Software Foundation, Inc., 59 Temple Place,
 * Suite 330, Boston, MA 02111-1307 USA
 *
 * @package gridclasskey
 * @subpackage processor
 */
require_once MODX_CORE_PATH . 'model/modx/processors/resource/getlist.class.php';

class GridContainerGetListProcessor extends modResourceGetListProcessor {

    public $defaultSortField = 'id';
    public $defaultSortDirection = 'DESC';

    /** @var modAction $editAction */
    public $editAction;
    protected $parentProperties;
    protected $selectedFields = array();
    protected $selectedMainFields = array();
    protected $selectedTVFields = array();
    protected $selectedSnippetFields = array();
    protected $andCondition = array();
    protected $orCondition = array();
    protected $condition = '';

    public function initialize() {
        $vers = $this->modx->getVersionData();
        $ver_comp = version_compare($vers['full_version'], '2.3.0');
        if ($ver_comp >= 0) {
            $this->editAction = 'resource/update';
        } else {
            $editAction = $this->modx->getObject('modAction', array(
                'namespace' => 'core',
                'controller' => 'resource/update',
            ));
            $this->editAction = $editAction->get('id');
        }

        $parent = $this->getProperty('parent');
        if (empty($parent)) {
            return $this->failure($this->modx->lexicon('gridclasskey.parent_missing_err'));
        }

        $this->parentProperties = $this->modx->getObject('modResource', $parent)->getProperties('gridclasskey');
        $sort = $this->getProperty('sort');
        if (!empty($sort)) {
            $this->setProperty('sort', $this->modx->escape($sort));
        } else {
            if ($this->parentProperties && $this->parentProperties['grid-sortby']) {
                $this->setProperty('sort', $this->modx->escape($this->parentProperties['grid-sortby']));
                $this->setProperty('dir', in_array(strtolower($this->parentProperties['grid-sortdir']), array('asc', 'desc')) ? strtolower($this->parentProperties['grid-sortdir']) : 'desc');
            }
        }

        $condition = $this->getProperty('condition', 'or');
        $this->condition = $condition === 'or' ? 'orCondition' : 'andCondition';

        $limit = intval($this->getProperty('limit'));
        if ($limit === 0) {
            $this->setProperty('limit', $this->modx->getOption('default_per_page'));
        }

        return parent::initialize();
    }

    /**
     * Can be used to adjust the query prior to the COUNT statement
     *
     * @param xPDOQuery $c
     * @return xPDOQuery
     */
    public function prepareQueryBeforeCount(xPDOQuery $c) {
        $parent = $this->getProperty('parent');
        $c->where(array(
            'modResource.parent' => $parent
        ));

        $mainFields = $this->modx->getSelectColumns('modResource');
        $mainFields = str_replace('`', '', $mainFields);
        $mainFields = array_map('trim', @explode(',', $mainFields));

        if (!empty($this->parentProperties) && is_array($this->parentProperties) &&
                !empty($this->parentProperties['fields']) && is_array($this->parentProperties['fields'])) {
            foreach ($this->parentProperties['fields'] as $field) {
                $this->selectedFields = array_merge($this->selectedFields, (array) $field['name']);
            }
        } else {
            $this->selectedFields = array('id', 'pagetitle', 'deleted', 'published', 'hidemenu');
        }

        // whatever selected sort field is, add it to the array
        $sort = str_replace('`', '', $this->getProperty('sort'));
        $isFound = array_search($sort, $this->selectedFields);
        if (!$isFound) {
            $this->selectedFields = array_merge($this->selectedFields, (array) $sort);
        }

        $this->selectedMainFields = array_intersect($this->selectedFields, $mainFields);
        $this->selectedMainFields = array_values($this->selectedMainFields);
        $c->select($this->modx->getSelectColumns('modResource', 'modResource', '', $this->selectedMainFields));

        $query = $this->getProperty('query');
        if (!empty($query)) {
            $this->orCondition = array_merge($this->orCondition, array(
                "modResource.pagetitle:LIKE" => "%{$query}%",
                "modResource.longtitle:LIKE" => "%{$query}%",
                "modResource.menutitle:LIKE" => "%{$query}%",
                "modResource.description:LIKE" => "%{$query}%",
            ));
        }

        if (!empty($this->parentProperties) && is_array($this->parentProperties)) {
            // backward compatibility
            $fixParentProperties = false;
            $this->selectedElementFields = array_diff($this->selectedFields, $this->selectedMainFields);
            if (!empty($this->parentProperties['fields']) && is_array($this->parentProperties['fields'])) {
                foreach ($this->parentProperties['fields'] as $k => $field) {
                    if (in_array($field['name'], $this->selectedElementFields)) {
                        if ($field['type'] === 'snippet') {
                            $this->selectedSnippetFields = array_merge($this->selectedSnippetFields, (array) $field['name']);
                        } else {
                            $this->selectedTVFields = array_merge($this->selectedTVFields, (array) $field['name']);
                            // backward compatibility : adding 'type'
                            if (!isset($this->parentProperties['fields'][$k]['type']) || empty($this->parentProperties['fields'][$k]['type'])) {
                                $this->parentProperties['fields'][$k]['type'] = 'tv';
                                $fixParentProperties = true;
                            }
                        }
                    } elseif (in_array($field['name'], $this->selectedMainFields)) {
                        // backward compatibility : adding 'type'
                        if (!isset($this->parentProperties['fields'][$k]['type']) || empty($this->parentProperties['fields'][$k]['type'])) {
                            $this->parentProperties['fields'][$k]['type'] = 'main';
                            $fixParentProperties = true;
                        }
                    }
                }
            }
            $this->selectedTVFields = array_values($this->selectedTVFields);
            $tvLoopIndex = 0;
            if (!empty($this->selectedTVFields)) {
                foreach ($this->selectedTVFields as $k => $tv) {
                    $tvLoopIndex++;
                    $this->_joinTV($c, $tvLoopIndex, $tv, $query);
                }
            }

            // backward compatibility
            if ($fixParentProperties) {
                $parentObj = $this->modx->getObject('modResource', $parent);
                $parentObj->setProperties($this->parentProperties, 'gridclasskey');
                $parentObj->save();
            }
        }

        // advanced search
        $advancedSearch = $this->getProperty('advancedSearch');
        if (!empty($advancedSearch)) {
            if (!empty($query)) {
                $this->{$this->condition} = array_merge($this->{$this->condition}, array(
                    "modResource.pagetitle LIKE '%{$query}%'",
                    "modResource.longtitle LIKE '%{$query}%'",
                    "modResource.menutitle LIKE '%{$query}%'",
                    "modResource.description LIKE '%{$query}%'",
                ));
            }

            $template = $this->getProperty('template');
            if (!empty($template)) {
                $this->{$this->condition} = array_merge($this->{$this->condition}, array(
                    'modResource.template' => $template,
                ));
            }
            $fields = $this->getProperty('fields');
            if (!empty($fields)) {
                $fieldsArray = json_decode($fields, 1);
                foreach ($fieldsArray as $k => $field) {
                    if (in_array($field['name'], $mainFields)) {
                        $this->{$this->condition} = array_merge($this->{$this->condition}, array(
                            'modResource.' . $field['name'] . ':LIKE' => "%{$field['value']}%"
                        ));
                        unset($fieldsArray[$k]);
                    }
                }
                if (!empty($fieldsArray)) {
                    foreach ($fieldsArray as $k => $tv) {
                        $tvLoopIndex++;
                        $this->_joinTV($c, $tvLoopIndex, $tv['name'], $tv['value']);
                    }
                }
            }
        }

        if (!empty($this->andCondition)) {
            $c->andCondition($this->andCondition);
        }

        if (!empty($this->orCondition)) {
            $c->orCondition(array($this->orCondition));
        }

        return $c;
    }

    private function _joinTV(&$c, $index, $tvName, $query = '') {
        $tvObj = $this->modx->getObject('modTemplateVar', array(
            'name' => $tvName
        ));

        if ($tvObj) {
            $tvId = $tvObj->get('id');
            $c->select(array(
                $this->modx->escape($tvName) => 'TemplateVarResources_' . $index . '.value',
            ));
            $c->leftJoin('modTemplateVarResource', 'TemplateVarResources_' . $index, array(
                'TemplateVarResources_' . $index . '.contentid = modResource.id',
                $tvId . ' = TemplateVarResources_' . $index . '.tmplvarid',
            ));
            if (!empty($query)) {
                $this->{$this->condition} = array_merge($this->{$this->condition}, array(
                    'TemplateVarResources_' . $index . '.value:LIKE' => '%' . $query . '%',
                ));
            }
        }
    }

    /**
     * @param object $object
     * @return array
     */
    public function prepareRow(xPDOObject $object) {
        $resourceArray = parent::prepareRow($object);

        foreach ($resourceArray as $field => $value) {
            if (!in_array($field, $this->selectedFields) &&
                    $field !== 'id' &&
                    $field !== 'parent' &&
                    $field !== 'published' &&
                    $field !== 'deleted' &&
                    $field !== 'hidemenu' &&
                    $field !== 'context_key' &&
                    $field !== 'isfolder' &&
                    $field !== 'show_in_tree'
            ) {
                unset($resourceArray[$field]);
                continue;
            }
            // avoid null on returns
            $resourceArray[$field] = $resourceArray[$field] !== null ? $resourceArray[$field] : '';

            if (!empty($this->selectedTVFields)) {
                $key = array_search($field, $this->selectedTVFields);
                if (is_numeric($key)) {
                    $resourceArray[$field . '_output'] = $object->getTVValue($field);
                }
            }
        }

        if (isset($resourceArray['publishedon'])) {
            $publishedon_timestamp = strtotime($resourceArray['publishedon']);
            $resourceArray['publishedon_date'] = strftime($this->modx->getOption('gridclasskey.mgr_date_format', null, '%b %d'), $publishedon_timestamp);
            $resourceArray['publishedon_time'] = strftime($this->modx->getOption('gridclasskey.mgr_time_format', null, '%I:%M %p'), $publishedon_timestamp);
        }

        if (!empty($this->parentProperties)) {
            foreach ($this->parentProperties['fields'] as $field) {
                // [#131] exclude some booleans for output filter because ExtJs needs it
                if ($field['name'] === 'published' ||
                        $field['name'] === 'deleted'
                ) {
                    continue;
                }
                if ($field['type'] === 'snippet') {
                    $scriptProperties = $resourceArray;
                    unset($scriptProperties[$field['name']]);
                    $resourceArray[$field['name']] = $this->modx->runSnippet($field['name'], $scriptProperties);
                }
                if (!empty($field['output_filter'])) {
                    // [#141] inline editor is NOT compatible with cell's output filter
//                    $resourceArray[$field['name']] = $this->_outputFilter($resourceArray[$field['name']], $field['output_filter']);
                    if (isset($resourceArray[$field['name'] . '_output']) && !empty($resourceArray[$field['name'] . '_output'])) {
                        $resourceArray[$field['name'] . '_output'] = $this->_outputFilter($resourceArray[$field['name'] . '_output'], $field['output_filter']);
                    }
                }
            }
        }
        $resourceArray['action_edit'] = '?a=' . $this->editAction . '&id=' . $resourceArray['id'];

        $this->modx->getContext($resourceArray['context_key']);
        $resourceArray['preview_url'] = $this->modx->makeUrl($resourceArray['id'], $resourceArray['context_key'], null, 'full');

        $c = $this->modx->newQuery('modResource');
        $c->where(array(
            'parent' => $resourceArray['id']
        ));
        $c->limit(1);
        $resourceArray['has_children'] = (bool) $this->modx->getCount('modResource', $c);

        return $resourceArray;
    }

    /**
     * @see core/model/modx/filters/modoutputfilter.class.php
     * @see modOutputFilter::filter()
     */
    private function _outputFilter($string, $outputFilter) {
        $chunk = $this->modx->newObject('modChunk');
        // just to create a name for the modChunk object.
        $outputFilter = ltrim($outputFilter, ':');
        $name = rand(5, 15) . ':' . $outputFilter;
        $chunk->set('name', $name);
        $chunk->setCacheable(false);
        $chunk->setContent($string);
        $chunk->_processed = false;
        return $chunk->process();
    }

    /**
     * Return arrays of objects (with count) converted to JSON.
     *
     * The JSON result includes two main elements, total and results. This format is used for list
     * results.
     *
     * @access public
     * @param array $array An array of data objects.
     * @param mixed $count The total number of objects. Used for pagination.
     * @return string The JSON output.
     */
    public function outputArray(array $array, $count = false) {
        if ($count === false) {
            $count = count($array);
        }

        return '{"total":"' . $count . '","results":' . $this->modx->toJSON($array) . ',"sortby":"' . $this->parentProperties['grid-sortby'] . '","sortdir":"' . $this->parentProperties['grid-sortdir'] . '"}';
    }

}

return 'GridContainerGetListProcessor';
