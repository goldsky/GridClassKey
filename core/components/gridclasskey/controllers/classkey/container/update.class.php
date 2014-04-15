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
/**
 * @var modX $modx
 */
if(!class_exists('ResourceUpdateManagerController')) {
    require_once $modx->getOption('manager_path', null, MODX_MANAGER_PATH) . 'controllers/default/resource/update.class.php';
}

/**
 * @package gridclasskey
 */
class GridContainerUpdateManagerController extends ResourceUpdateManagerController {

    public function loadCustomCssJs() {
        $managerUrl = $this->context->getOption('manager_url', MODX_MANAGER_URL, $this->modx->_userConfig);
        $gridclasskeyAssetsUrl = $this->modx->getOption('gridclasskey.assets_url'
                , null
                , $this->modx->getOption('assets_url', null, MODX_ASSETS_URL) . 'components/gridclasskey/');
        $connectorUrl = $gridclasskeyAssetsUrl . 'connector.php';
        $gridclasskeyJsUrl = $gridclasskeyAssetsUrl . 'js/';

        $defaultGridClassKeyCorePath = $this->modx->getOption('core_path') . 'components/gridclasskey/';
        $gridclasskeyCorePath = $this->modx->getOption('gridclasskey.core_path', null, $defaultGridClassKeyCorePath);
        $gridclasskey = $this->modx->getService('gridclasskey', 'GridClassKey', $gridclasskeyCorePath . 'model/', $scriptProperties);

        if (!($gridclasskey instanceof GridClassKey)) {
            return;
        }

        $version = str_replace(' ', '',$gridclasskey->config['version']);
        $settings = $this->resource->getProperties('gridclasskey');
        if (!empty($settings['grid-top-js'])) {
            $this->addJavascript($settings['grid-top-js'] . '?v=' . $version);
        }
        $this->addJavascript($managerUrl . 'assets/modext/util/datetime.js');
        $this->addJavascript($managerUrl . 'assets/modext/widgets/element/modx.panel.tv.renders.js');
        $this->addJavascript($managerUrl . 'assets/modext/widgets/resource/modx.grid.resource.security.js');
        $this->addJavascript($managerUrl . 'assets/modext/widgets/resource/modx.panel.resource.tv.js');
        $this->addJavascript($managerUrl . 'assets/modext/widgets/resource/modx.panel.resource.js');
        $this->addJavascript($managerUrl . 'assets/modext/sections/resource/update.js');
        $this->addJavascript($gridclasskeyJsUrl . 'mgr/gridclasskey.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/panel.settings.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/combo.template.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/combo.snippetfields.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/panel.combo.snippetfields.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/combo.tvfields.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/panel.combo.tvfields.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/combo.mainfields.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/panel.combo.mainfields.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/grid.gridsettings.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/grid.children.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/panel.container.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/page.updatecontainer.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/window.actions.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/grid.advancedsearch.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/window.advancedsearch.js?v=' . $version);
        $this->addHtml('
        <script type="text/javascript">
        // <![CDATA[
        GridClassKey.config = {
            assetsUrl: "' . $gridclasskeyAssetsUrl . '"
            , connectorUrl: "' . $connectorUrl . '"
        };
        MODx.config.publish_document = "' . $this->canPublish . '";
        MODx.onDocFormRender = "' . $this->onDocFormRender . '";
        MODx.ctx = "' . $this->resource->get('context_key') . '";
        Ext.onReady(function() {
            MODx.load({
                xtype: "gridclasskey-page-container-update"
                ,resource: "' . $this->resource->get('id') . '"
                ,record: ' . $this->modx->toJSON($this->resourceArray) . '
                ,publish_document: "' . $this->canPublish . '"
                ,preview_url: "' . $this->previewUrl . '"
                ,locked: ' . ($this->locked ? 1 : 0) . '
                ,lockedText: "' . $this->lockedText . '"
                ,canSave: ' . ($this->canSave ? 1 : 0) . '
                ,canEdit: ' . ($this->canEdit ? 1 : 0) . '
                ,canCreate: ' . ($this->canCreate ? 1 : 0) . '
                ,canDuplicate: ' . ($this->canDuplicate ? 1 : 0) . '
                ,canDelete: ' . ($this->canDelete ? 1 : 0) . '
                ,show_tvs: ' . (!empty($this->tvCounts) ? 1 : 0) . '
                ,mode: "update"
            });
        });
        // ]]>
        </script>');
        /* load RTE */
        $this->loadRichTextEditor();
        if (!empty($settings['grid-bottom-js'])) {
            $this->addLastJavascript($settings['grid-bottom-js']);
        }
    }

    public function getLanguageTopics() {
        return array('resource', 'gridclasskey:default');
    }

    /**
     * Used to set values on the resource record sent to the template for derivative classes
     *
     * @return void
     */
    public function prepareResource() {
        $settings = $this->resource->getProperties('gridclasskey');
        if (is_array($settings) && !empty($settings)) {
            foreach ($settings as $k => $v) {
                $this->resourceArray['gridclasskey-property-' . $k] = $v;
            }
        }
    }

}
