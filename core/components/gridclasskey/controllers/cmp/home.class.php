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
 * @subpackage cmp
 */

class GridClassKeyCmpHomeManagerController extends GridClassKeyManagerController {

    public function process(array $scriptProperties = array()) {

    }

    public function getPageTitle() {
        return $this->modx->lexicon('gridclasskey');
    }

    public function loadCustomCssJs() {
        $version = str_replace(' ', '', $this->gridclasskey->config['version']);
        $isJsCompressed = $this->modx->getOption('compress_js');
        $withVersion = $isJsCompressed? '' : '?v=' . $version;
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/panel.settings.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/combo.template.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/combo.snippetfields.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/panel.combo.snippetfields.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/combo.tvfields.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/panel.combo.tvfields.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/combo.mainfields.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/panel.combo.mainfields.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/grid.gridsettings.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/grid.children.js' . $withVersion);

        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/cmp/widgets/window.setting.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/cmp/widgets/grid.containers.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/cmp/widgets/panel.home.js' . $withVersion);
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/cmp/sections/index.js' . $withVersion);
        $this->addHtml('<script type="text/javascript">
        MODx.version_is22 = ' . version_compare('2.2.100', $this->modx->getOption('settings_version')) . ';
        MODx.perm["edit_document"] = ' . ($this->modx->hasPermission('edit_document') ? 1 : 0) . ';
        MODx.perm["delete_document"] = ' . ($this->modx->hasPermission('delete_document') ? 1 : 0) . ';
        MODx.perm["undelete_document"] = ' . ($this->modx->hasPermission('undelete_document') ? 1 : 0) . ';
        MODx.perm["publish_document"] = ' . ($this->modx->hasPermission('publish_document') ? 1 : 0) . ';
        MODx.perm["unpublish_document"] = ' . ($this->modx->hasPermission('unpublish_document') ? 1 : 0) . ';
        Ext.onReady(function() {
            MODx.load({xtype: "gridclasskey-page-home"});
        });
        </script>');
    }

    public function getTemplateFile() {
        return $this->gridclasskey->config['templatesPath'] . 'home.tpl';
    }

}