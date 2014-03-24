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
 * @subpackage controller
 */
require_once dirname(__FILE__) . '/model/gridclasskey.class.php';

abstract class GridClassKeyManagerController extends modExtraManagerController {

    /** @var GridClassKey $gridclasskey */
    public $gridclasskey;

    public function initialize() {
        $this->gridclasskey = new GridClassKey($this->modx);
        $version = str_replace(' ', '', $this->gridclasskey->config['version']);
        $this->addCss($this->gridclasskey->config['cssUrl'] . 'mgr.css?v=' . $version);
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/gridclasskey.js?v=' . $version);
        $this->addHtml('<script type="text/javascript">
        Ext.onReady(function() {
            GridClassKey.config = ' . $this->modx->toJSON($this->gridclasskey->config) . ';
        });
        </script>');
        return parent::initialize();
    }

    public function getLanguageTopics() {
        return array('gridclasskey:default', 'gridclasskey:cmp');
    }

    public function checkPermissions() {
        return true;
    }

}

class IndexManagerController extends GridClassKeyManagerController {

    public static function getDefaultController() {
        return 'cmp/home';
    }

}
