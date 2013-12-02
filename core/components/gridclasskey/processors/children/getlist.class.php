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

        $parent = $this->getProperty('parent');
        if ($parent) {
            $this->parentProperties = $this->modx->getObject('modResource', $parent)->getProperties('gridclasskey');
            foreach ($this->parentProperties['fields'] as $field) {
                $this->selectedFields = array_merge($this->selectedFields, (array) $field['name']);
            }

            $mainFields = $this->modx->getSelectColumns('modResource');
            $mainFields = str_replace('`', '', $mainFields);
            $this->selectedMainFields = @explode(',', $mainFields);
            array_walk($this->selectedMainFields, create_function('&$v', '$v = trim($v);'));

            $this->selectedMainFields = array_intersect($this->selectedFields, $this->selectedMainFields);
            $this->selectedMainFields = array_values($this->selectedMainFields);
            $c->select($this->modx->getSelectColumns('modResource', 'modResource', '', $this->selectedMainFields));

            $this->selectedTVFields = array_diff($this->selectedFields, $this->selectedMainFields);
            $this->selectedTVFields = array_values($this->selectedTVFields);
            $c->where(array(
                'modResource.parent' => $parent
            ));
            if (!empty($this->selectedTVFields)) {
                foreach ($this->selectedTVFields as $k => $tv) {
                    $c->select(array(
                        $this->modx->escape($tv) => 'TemplateVarResources_' . $k . '.value',
                    ));
                    $tvId = $this->modx->getObject('modTemplateVar', array(
                        'name' => $tv
                    ))->get('id');
                    $c->leftJoin('modTemplateVarResource', 'TemplateVarResources_' . $k, array(
                        'TemplateVarResources_' . $k . '.contentid = modResource.id',
                        $tvId .' = TemplateVarResources_' . $k . '.tmplvarid',
                    ));
                    if (!empty($query)) {
                        $c->orCondition(array(
                            'modResource.parent:=' => $parent,
                            'AND:TemplateVarResources_' . $k . '.value:LIKE' => '%' . $query . '%',
                        ));
                    }
                }
            }
        }

        return $c;
    }

    /**
     * {@inheritDoc}
     * @return mixed
     */
    public function process() {
        $beforeQuery = $this->beforeQuery();
        if ($beforeQuery !== true) {
            return $this->failure($beforeQuery);
        }
        $data = $this->getData();
        if (empty($data['results'])) {
            return $this->failure($this->modx->lexicon('gridclasskey.empty'));
        }
        $list = $this->iterate($data);
        return $this->outputArray($list, $data['total']);
    }

    /**
     * @param $resource $object
     * @return array
     */
    public function prepareRow(xPDOObject $object) {
        $resourceArray = parent::prepareRow($object);

        if (!empty($resourceArray['publishedon'])) {
            $publishedon = strtotime($resourceArray['publishedon']);
            $resourceArray['publishedon_date'] = strftime($this->modx->getOption('articles.mgr_date_format', null, '%b %d'), $publishedon);
            $resourceArray['publishedon_time'] = strftime($this->modx->getOption('articles.mgr_time_format', null, '%H:%I %p'), $publishedon);
            $resourceArray['publishedon'] = strftime('%b %d, %Y %H:%I %p', $publishedon);
        }

        foreach ($resourceArray as $field => $value) {
            if (!in_array($field, $this->selectedFields)) {
                unset($resourceArray[$field]);
                continue;
            }
            // avoid null on returns
            $resourceArray[$field] = $resourceArray[$field] !== null ? $resourceArray[$field] : '';
        }

        if (!empty($this->parentProperties)) {
            foreach ($this->parentProperties['fields'] as $field) {
                if (!empty($field['output_filter'])) {
                    /**
                     * @see modOutputFilter::filter()
                     */
                    $params = array(
                        'input' => $resourceArray[$field['name']]
                    );
                    $tmp = $this->modx->runSnippet($field['output_filter'], $params);
                    if (!empty($tmp)) {
                        $resourceArray[$field['name']] = $tmp;
                    }
                }
            }
        }
        $resourceArray['action_edit'] = '?a=' . $this->editAction->get('id') . '&id=' . $resourceArray['id'];

        $this->modx->getContext($resourceArray['context_key']);
        $resourceArray['preview_url'] = $this->modx->makeUrl($resourceArray['id'], $resourceArray['context_key']);

        return $resourceArray;
    }

}

return 'GridContainerGetListProcessor';
