<?php

/**
 * Grid Class Key
 *
 * Copyright 2013 by goldsky <goldsky@virtudraft.com>
 *
 * This file is part of Grid Class Key, a custom class key for MODX
 * Revolution's Manager to hide child resources inside container's grid.
 *
 * Grid Class Key is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation version 3,
 *
 * Grid Class Key is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * Grid Class Key; if not, write to the Free Software Foundation, Inc., 59 Temple Place,
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

    public function initialize() {
        $this->editAction = $this->modx->getObject('modAction', array(
            'namespace' => 'core',
            'controller' => 'resource/update',
        ));
        $parent = $this->getProperty('parent');
        if (empty($parent)) {
            return $this->failure($this->modx->lexicon('gridclasskey.parent_missing_err'));
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
        $query = $this->getProperty('query');
        if (!empty($query)) {
            $c->andCondition(array(
                'modResource.pagetitle:LIKE' => '%' . $query . '%',
                'OR:modResource.longtitle:LIKE' => '%' . $query . '%',
                'OR:modResource.menutitle:LIKE' => '%' . $query . '%',
                'OR:modResource.description:LIKE' => '%' . $query . '%',
            ));
        }

        $mainFields = $this->modx->getSelectColumns('modResource');
        $mainFields = str_replace('`', '', $mainFields);
        $mainFields = @explode(',', $mainFields);
        array_walk($mainFields, create_function('&$v', '$v = trim($v);'));

        $tvLoopIndex = 0;
        $parent = $this->getProperty('parent');

        $this->parentProperties = $this->modx->getObject('modResource', $parent)->getProperties('gridclasskey');
        if ($this->parentProperties) {
            foreach ($this->parentProperties['fields'] as $field) {
                $this->selectedFields = array_merge($this->selectedFields, (array) $field['name']);
            }

            $this->selectedMainFields = array_intersect($this->selectedFields, $mainFields);
            $this->selectedMainFields = array_values($this->selectedMainFields);
            $c->select($this->modx->getSelectColumns('modResource', 'modResource', '', $this->selectedMainFields));

            $this->selectedTVFields = array_diff($this->selectedFields, $this->selectedMainFields);
            $this->selectedTVFields = array_values($this->selectedTVFields);
        }
        if (!empty($this->selectedTVFields)) {
            foreach ($this->selectedTVFields as $k => $tv) {
                $this->_joinTV($c, $tvLoopIndex, $tv, $query);
                $tvLoopIndex++;
            }
        }

        // advanced search
        $template = $this->getProperty('template');
        if (!empty($template)) {
            $c->andCondition(array(
                'modResource.template' => $template
            ));
        }
        $fields = $this->getProperty('fields');
        if (!empty($fields)) {
            $fieldsArray = json_decode($fields, 1);
            foreach ($fieldsArray as $k => $field) {
                if (in_array($field['name'], $mainFields)) {
                    $c->andCondition(array(
                        'modResource.' . $field['name'] . ':LIKE' => "%{$field['value']}%"
                    ));
                    unset($fieldsArray[$k]);
                }
            }
            if (!empty($fieldsArray)) {
                foreach ($fieldsArray as $k => $tv) {
                    $this->_joinTV($c, $tvLoopIndex, $tv['name'], $tv['value']);
                    $tvLoopIndex++;
                }
            }
        }

        $c->where(array(
            'modResource.parent' => $parent
        ));

        return $c;
    }

    private function _joinTV($c, $index, $tvName, $query = '') {
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
                $parent = $this->getProperty('parent');
                if (!empty($parent)) {
                    $c->orCondition(array(
                        'modResource.parent:=' => $parent,
                        'AND:TemplateVarResources_' . $index . '.value:LIKE' => '%' . $query . '%',
                    ));
                } else {
                    $c->orCondition(array(
                        'TemplateVarResources_' . $index . '.value:LIKE' => '%' . $query . '%',
                    ));
                }
            }
        }
    }

    /**
     * @param $resource $object
     * @return array
     */
    public function prepareRow(xPDOObject $object) {
        $resourceArray = parent::prepareRow($object);

        foreach ($resourceArray as $field => $value) {
            if (!in_array($field, $this->selectedFields) &&
                    $field !== 'published' &&
                    $field !== 'deleted' &&
                    $field !== 'hidemenu' &&
                    $field !== 'isfolder'
            ) {
                unset($resourceArray[$field]);
                continue;
            }
            // avoid null on returns
            $resourceArray[$field] = $resourceArray[$field] !== null ? $resourceArray[$field] : '';
        }

        if (isset($resourceArray['publishedon'])) {
            $publishedon = strtotime($resourceArray['publishedon']);
            $resourceArray['publishedon_date'] = strftime($this->modx->getOption('articles.mgr_date_format', null, '%b %d'), $publishedon);
            $resourceArray['publishedon_time'] = strftime($this->modx->getOption('articles.mgr_time_format', null, '%H:%I %p'), $publishedon);
            $resourceArray['publishedon'] = strftime('%b %d, %Y %H:%I %p', $publishedon);
        }

        if (!empty($this->parentProperties)) {
            foreach ($this->parentProperties['fields'] as $field) {
                if (!empty($field['output_filter'])) {
                    $resourceArray[$field['name']] = $this->_outputFilter($resourceArray[$field['name']], $field['output_filter']);
                }
            }
        }
        $resourceArray['action_edit'] = '?a=' . $this->editAction->get('id') . '&id=' . $resourceArray['id'];

        $this->modx->getContext($resourceArray['context_key']);
        $resourceArray['preview_url'] = $this->modx->makeUrl($resourceArray['id'], $resourceArray['context_key']);

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
}

return 'GridContainerGetListProcessor';
