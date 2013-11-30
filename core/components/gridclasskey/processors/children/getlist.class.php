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

    public function initialize() {
        $this->editAction = $this->modx->getObject('modAction',array(
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
        $parent = $this->getProperty('parent');
        if ($parent) {
            $c->where(array(
                'parent' => $parent
            ));
        }
        $query = $this->getProperty('query');
        if (!empty($query)) {
            $c->where(array(
                'pagetitle:LIKE' => '%' . $query . '%',
                'OR:longtitle:LIKE' => '%' . $query . '%',
                'OR:menutitle:LIKE' => '%' . $query . '%',
                'OR:description:LIKE' => '%' . $query . '%',
            ));
        }
        return $c;
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
        $resourceArray['action_edit'] = '?a=' . $this->editAction->get('id') . '&id=' . $resourceArray['id'];

        $this->modx->getContext($resourceArray['context_key']);
        $resourceArray['preview_url'] = $this->modx->makeUrl($resourceArray['id'], $resourceArray['context_key']);

        return $resourceArray;
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
        return $this->outputArray($list,$data['total']);
    }

}

return 'GridContainerGetListProcessor';
