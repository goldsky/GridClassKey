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
if(!class_exists('ResourceCreateManagerController')) {
    require_once $modx->getOption('manager_path', null, MODX_MANAGER_PATH) . 'controllers/default/resource/create.class.php';
}

/**
 * @package gridclasskey
 */
class GridContainerCreateManagerController extends ResourceCreateManagerController {

    /** @var GridContainer $resource */
    public $resource;

    public function loadCustomCssJs() {
        $managerUrl = $this->context->getOption('manager_url', MODX_MANAGER_URL, $this->modx->_userConfig);
        $gridclasskeyAssetsUrl = $this->modx->getOption('gridclasskey.assets_url'
                , null
                , $this->modx->getOption('assets_url', null, MODX_ASSETS_URL) . 'components/gridclasskey/');
        $connectorUrl = $gridclasskeyAssetsUrl . 'connector.php';
        $gridclasskeyJsUrl = $gridclasskeyAssetsUrl . 'js/';

        $this->addJavascript($managerUrl . 'assets/modext/util/datetime.js');
        $this->addJavascript($managerUrl . 'assets/modext/widgets/element/modx.panel.tv.renders.js');
        $this->addJavascript($managerUrl . 'assets/modext/widgets/resource/modx.grid.resource.security.js');
        $this->addJavascript($managerUrl . 'assets/modext/widgets/resource/modx.panel.resource.tv.js');
        $this->addJavascript($managerUrl . 'assets/modext/widgets/resource/modx.panel.resource.js');
        $this->addJavascript($managerUrl . 'assets/modext/sections/resource/create.js');
        
        $defaultGridClassKeyCorePath = $this->modx->getOption('core_path') . 'components/gridclasskey/';
        $gridclasskeyCorePath = $this->modx->getOption('gridclasskey.core_path', null, $defaultGridClassKeyCorePath);
        $gridclasskey = $this->modx->getService('gridclasskey', 'GridClassKey', $gridclasskeyCorePath . 'model/', $scriptProperties);

        if (!($gridclasskey instanceof GridClassKey)) {
            return;
        }

        $version = str_replace(' ', '',$gridclasskey->config['version']);
        $this->addJavascript($gridclasskeyJsUrl . 'mgr/gridclasskey.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/panel.settings.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/combo.template.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/combo.tvfields.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/panel.combo.tvfields.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/combo.mainfields.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/panel.combo.mainfields.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/grid.gridsettings.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/panel.container.js?v=' . $version);
        $this->addLastJavascript($gridclasskeyJsUrl . 'mgr/classkey/container/page.createcontainer.js?v=' . $version);
        
        $this->prepareResource();
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
                xtype: "gridclasskey-page-container-create"
                ,resource: "' . $this->resource->get('id') . '"
                ,record: ' . $this->modx->toJSON($this->resourceArray) . '
                ,publish_document: "' . $this->canPublish . '"
                ,canSave: ' . ($this->canSave ? 1 : 0) . '
                ,canEdit: ' . ($this->canEdit ? 1 : 0) . '
                ,canCreate: ' . ($this->canCreate ? 1 : 0) . '
                ,canDuplicate: ' . ($this->canDuplicate ? 1 : 0) . '
                ,canDelete: ' . ($this->canDelete ? 1 : 0) . '
                ,show_tvs: ' . (!empty($this->tvCounts) ? 1 : 0) . '
                ,mode: "create"
            });
        });
        // ]]>
        </script>');
        /* load RTE */
        $this->loadRichTextEditor();
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
        } elseif ($this->parent) {
            $parentSettings = $this->parent->getProperties('gridclasskey');
            if (is_array($parentSettings) && isset($parentSettings['child-properties'])) {
                $settings = json_decode($parentSettings['child-properties'], 1);
                $this->resourceArray['properties'] = $settings;
                if (isset($settings['gridclasskey']) && !empty($settings['gridclasskey'])) {
                    foreach ($settings['gridclasskey'] as $k => $v) {
                        $this->resourceArray['gridclasskey-property-' . $k] = $v;
                    }
                }
            }
        }
    }

    public function getPageTitle() {
        return $this->modx->lexicon('gridclasskey.container_new');
    }

}
