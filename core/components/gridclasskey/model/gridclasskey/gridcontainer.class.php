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
 * @subpackage model
 */
require_once MODX_CORE_PATH . 'model/modx/modprocessor.class.php';
require_once MODX_CORE_PATH . 'model/modx/processors/resource/create.class.php';
require_once MODX_CORE_PATH . 'model/modx/processors/resource/update.class.php';

class GridContainer extends modResource {

    public $showInContextMenu = true;

    public function __construct(xPDO & $xpdo) {
        parent :: __construct($xpdo);
        $this->set('class_key', 'GridContainer');
    }

    public static function getControllerPath(xPDO &$modx) {
        return $modx->getOption('gridclasskey.core_path'
                        , null
                        , $modx->getOption('core_path') . 'components/gridclasskey/') . 'controllers/container/';
    }

    public function getContextMenuText() {
        $this->xpdo->lexicon->load('gridclasskey:default');
        return array(
            'text_create' => $this->xpdo->lexicon('gridclasskey'),
            'text_create_here' => $this->xpdo->lexicon('gridclasskey.container_create_here'),
        );
    }

    public function getResourceTypeName() {
        $this->xpdo->lexicon->load('gridclasskey:default');
        return $this->xpdo->lexicon('gridclasskey');
    }

}

class GridContainerCreateProcessor extends modResourceCreateProcessor {

    /** @var GridContainer $object */
    public $object;

    public function beforeSave() {
        $this->object->set('class_key', 'GridContainer');
        $this->object->set('hide_children_in_tree', true);
        $this->object->set('cacheable', true);
        $this->object->set('isfolder', true);

        $properties = $this->getProperties();
        $settings = $this->object->getProperties('gridclasskey');
        foreach ($properties as $k => $v) {
            if (substr($k, 0, 22) == 'gridclasskey-property-') {
                $key = substr($k, 22);
                if ($v === 'false') {
                    $v = 0;
                } elseif ($v === 'true') {
                    $v = 1;
                }
                if ($key === 'fields') {
                    $v = json_decode($v, TRUE);
                }
                $settings[$key] = $v;
            }
        }

        $this->object->setProperties($settings, 'gridclasskey');

        return parent::beforeSave();
    }

    public function afterSave() {
        $this->setProperty('clearCache', true);
        return parent::afterSave();
    }

}

class GridContainerUpdateProcessor extends modResourceUpdateProcessor {

    /** @var GridContainer $object */
    public $object;

    public function beforeSave() {
        $this->object->set('class_key', 'GridContainer');
        $this->object->set('hide_children_in_tree', true);
        $this->object->set('cacheable', true);
        $this->object->set('isfolder', true);

        $properties = $this->getProperties();
        $settings = $this->object->getProperties('gridclasskey');
        foreach ($properties as $k => $v) {
            if (substr($k, 0, 22) == 'gridclasskey-property-') {
                $key = substr($k, 22);
                if ($v === 'false') {
                    $v = 0;
                } elseif ($v === 'true') {
                    $v = 1;
                }
                if ($key === 'fields') {
                    $v = json_decode($v, TRUE);
                }
                $settings[$key] = $v;
            }
        }

        $this->object->setProperties($settings, 'gridclasskey');

        return parent::beforeSave();
    }

    public function afterSave() {
        $this->setProperty('clearCache', true);
        return parent::afterSave();
    }

}
