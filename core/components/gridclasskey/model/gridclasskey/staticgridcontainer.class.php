<?php

/**
 * GridClassKey
 *
 * Copyright 2013 - 2014 by goldsky <goldsky@virtudraft.com>
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
 * @subpackage model
 */
require_once MODX_CORE_PATH . 'model/modx/modprocessor.class.php';
require_once MODX_CORE_PATH . 'model/modx/processors/resource/create.class.php';
require_once MODX_CORE_PATH . 'model/modx/processors/resource/update.class.php';
require_once MODX_CORE_PATH . 'model/modx/modstaticresource.class.php';

class StaticGridContainer extends modStaticResource {
    
    public $showInContextMenu = true;

    public function __construct(xPDO & $xpdo) {
        parent :: __construct($xpdo);
        $this->set('class_key', 'StaticGridContainer');
    }

    public static function getControllerPath(xPDO &$modx) {
        return $modx->getOption('gridclasskey.core_path'
                        , null
                        , $modx->getOption('core_path') . 'components/gridclasskey/') . 'controllers/classkey/staticcontainer/';
    }

    public function getContextMenuText() {
        $this->xpdo->lexicon->load('gridclasskey:default');
        return array(
            'text_create' => $this->xpdo->lexicon('gridclasskey.static_container'),
            'text_create_here' => $this->xpdo->lexicon('gridclasskey.static_container_create_here'),
        );
    }

    public function getResourceTypeName() {
        $this->xpdo->lexicon->load('gridclasskey:default');
        return $this->xpdo->lexicon('gridclasskey.static_container');
    }
}

class StaticGridContainerCreateProcessor extends modResourceCreateProcessor {

    /** @var StaticGridContainer $object */
    public $object;

    public function beforeSave() {
        $this->object->set('class_key', 'StaticGridContainer');
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
        // xcheckbox -> checkbox
        if (!isset($settings['child-hidemenu'])) {
            $settings['child-hidemenu'] = 0;
        }
        if (!isset($settings['child-searchable'])) {
            $settings['child-searchable'] = 0;
        }
        if (!isset($settings['child-richtext'])) {
            $settings['child-richtext'] = 0;
        }
        if (!isset($settings['child-published'])) {
            $settings['child-published'] = 0;
        }
        if (!isset($settings['child-cacheable'])) {
            $settings['child-cacheable'] = 0;
        }
        if (!isset($settings['deleted'])) {
            $settings['child-deleted'] = 0;
        }
        $this->object->setProperties($settings, 'gridclasskey');

        return parent::beforeSave();
    }

    public function afterSave() {
        $this->setProperty('clearCache', true);
        return parent::afterSave();
    }

}

class StaticGridContainerUpdateProcessor extends modResourceUpdateProcessor {

    /** @var StaticGridContainer $object */
    public $object;

    public function beforeSave() {
        $this->object->set('class_key', 'StaticGridContainer');
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
        // xcheckbox -> checkbox
        if (!isset($settings['child-hidemenu'])) {
            $settings['child-hidemenu'] = 0;
        }
        if (!isset($settings['child-searchable'])) {
            $settings['child-searchable'] = 0;
        }
        if (!isset($settings['child-richtext'])) {
            $settings['child-richtext'] = 0;
        }
        if (!isset($settings['child-published'])) {
            $settings['child-published'] = 0;
        }
        if (!isset($settings['child-cacheable'])) {
            $settings['child-cacheable'] = 0;
        }
        if (!isset($settings['deleted'])) {
            $settings['child-deleted'] = 0;
        }
        $this->object->setProperties($settings, 'gridclasskey');

        return parent::beforeSave();
    }

    public function afterSave() {
        $this->setProperty('clearCache', true);
        return parent::afterSave();
    }

}
