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
 * @subpackage elements
 */
switch ($modx->event->name) {
    case 'OnManagerPageInit':
        $cssFile = $modx->getOption('gridclasskey.assets_url', null, $modx->getOption('assets_url') . 'components/gridclasskey/') . 'css/mgr.css';
        $modx->regClientCSS($cssFile);
        $customCssFile = $modx->getOption('gridclasskey.mgr_css');
        if (!empty($customCssFile)) {
            $modx->regClientCSS($customCssFile);
        }
        break;
    case 'OnDocFormSave':
        if ($mode === modSystemEvent::MODE_UPD) {
            $classKey = $resource->get('class_key');
            $isHideChildren = $resource->get('hide_children_in_tree');
            $c = $modx->newQuery($classKey);
            $resourceId = $resource->get('id');
            $c->where(array(
                'parent' => $resourceId,
            ));
            $limit = (int) $modx->getOption('gridclasskey.unhide_children_in_tree_limit');
            if (!empty($limit)) {
                $c->limit($limit + 1);
                $numChildren = $modx->getCount($classKey, $c);
                if ($numChildren > $limit) {
                    return;
                }
            }
            if (($classKey !== 'GridContainer' &&
                    $classKey !== 'StaticGridContainer') &&
                    $isHideChildren == 1
            ) {
                $properties = $resource->get('properties');
                if ($properties['gridclasskey']) {
                    $resource->set('hide_children_in_tree', 0);
                    $resource->save();
                }
            }
        }
        break;
    case 'OnDocFormRender':
        if (empty($scriptProperties['mode']) || $scriptProperties['mode'] !== 'new') {
            return;
        }
        $parentId = filter_input(INPUT_GET, 'parent', FILTER_VALIDATE_INT);
        $parentResource = $modx->getObject('modResource', $parentId);
        if (!$parentResource ||
                ($parentResource->get('class_key') !== 'GridContainer' &&
                $parentResource->get('class_key') !== 'StaticGridContainer')
        ) {
            return;
        }
        $parentProperties = $parentResource->getProperties('gridclasskey');
        if (!$parentProperties) {
            return;
        }
        /**
         * @see manager\controllers\default\resource\create\ResourceCreateManagerController::process()
         */
        foreach ($parentProperties as $k => $v) {
            if (substr($k, 0, 6) == 'child-') {
                $key = substr($k, 6);
                if ($key === 'template') {
                    $modx->controller->setProperty($key, $v);
                } elseif ($key === 'content_type') {
                    $modx->_userConfig['default_' . $key] = $v;
                } elseif ($key === 'class_key') {
                    $modx->controller->resourceClass = $v;
                } elseif ($key === 'resource_groups') {
                    /**
                     * Because there is no place to override the recource group in run time,
                     * pretend the parent has these usergroups to be inherited
                     * @see manager\controllers\default\resource\resource\ResourceManagerController::getResourceGroups()
                     * @todo This does not work, because there is no place to hack the list
                     */
//                    $resourceGroups = json_decode($v, 1);
//                    $addMany = array();
//                    foreach ($resourceGroups as $k => $v) {
//                        $params = array(
//                            'document_group' => $v['id'],
//                            'document' => $parentId
//                        );
//                        $parentResGrpRes = $modx->getObject('modResourceGroupResource', $params);
//                        if ($v['access']) {
//                            if (!$parentResGrpRes) {
//                                $parentResGrpRes = $modx->newObject('modResourceGroupResource');
//                                $parentResGrpRes->fromArray($params);
//                            }
//                        } else {
//                            if ($parentResGrpRes) {
//                                $parentResGrpRes->set('document', 0);
//                            }
//                        }
//                        $addMany[] = $parentResGrpRes;
//                    }
//                    $parentResource->addMany($addMany);
                } elseif ($key === 'content_dispo' || $key === 'isfolder' || $key === 'syncsite') {
                    // no place to override
                } else {
                    /**
                     * convert some keys
                     * @see manager\controllers\default\resource\ResourceCreateManagerController::process()
                     */
                    if ($key === 'published') {
                        $key = 'publish';
                    }
                    if ($key === 'searchable') {
                        $key = 'search';
                    }
                    if ($key === 'cacheable') {
                        $key = 'cache';
                    }
                    $modx->_userConfig[$key . '_default'] = $v;
                }
            }
        }

        break;
    case 'OnDocFormPrerender':
        $action = $_GET['a'];
        $vers = $modx->getVersionData();
        $ver_comp = version_compare($vers['full_version'], '2.3.0');
        if ($ver_comp >= 0) {
            if ($action !== 'resource/create' && $action !== 'resource/update') {
                return false;
            }
        } else {
            $createAction = $modx->getObject('modAction', array(
                'namespace' => 'core',
                'controller' => 'resource/create',
            ));
            $editAction = $modx->getObject('modAction', array(
                'namespace' => 'core',
                'controller' => 'resource/update',
            ));
            if (intval($action) !== $createAction->get('id') && intval($action) !== $editAction->get('id')) {
                return false;
            }
        }

        $docId = isset($_GET['id']) ? intval($_GET['id']) : null;
        $parentId = isset($_GET['parent']) ? intval($_GET['parent']) : null;
        if (is_null($docId) && is_null($parentId)) {
            return false;
        }
        $resource = $modx->getObject('modResource', $docId);
        if ($resource) {
            if (!empty($docId)) {
                $classKey = $resource->get('class_key');
                if ($classKey === 'GridContainer' || $classKey === 'StaticGridContainer') {
                    $properties = $resource->getProperties('gridclasskey');
                    if ($properties['grid-css']) {
                        $modx->regClientCSS($properties['grid-css']);
                    }
                }
            }
            if (!empty($docId) && empty($parentId)) {
                $parentId = $resource->get('parent');
            }
        }

        $parentResource = $modx->getObject('modResource', $parentId);
        if (!$parentResource ||
                ($parentResource->get('class_key') !== 'GridContainer' &&
                $parentResource->get('class_key') !== 'StaticGridContainer')
        ) {
            return;
        }
        $modx->lexicon->load('gridclasskey:default');
        $parentProperties = $parentResource->getProperties('gridclasskey');
        if (!$parentProperties) {
            return;
        }

        $text = !empty($parentProperties['child-backbutton-text']) ? $parentProperties['child-backbutton-text'] : $modx->lexicon('gridclasskey.back_to_container');
        $modx->regClientStartupHTMLBlock('<script type="text/javascript">
Ext.onReady(function() {
    var actionButtons = Ext.getCmp("modx-action-buttons");
    if (actionButtons) {
        var backToParentBtn = {
            xtype: "button"
            , text: "' . $text . '"
            , handler: function() {
                Ext.getCmp("modx-resource-tree").loadAction(
                        "a=" + MODx.action["resource/update"]
                        + "&id=" + ' . $parentId . '
                        );
            }
        };
        actionButtons.insertButton(0, [backToParentBtn, "-"]);
        actionButtons.doLayout();
    }
});
        </script>');
        break;
    default:
        break;
}

return;
