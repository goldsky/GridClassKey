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
        break;
    case 'OnDocFormSave':
        if ($mode === 'upd') {
            $classKey = $resource->get('class_key');
            $isHideChildren = $resource->get('hide_children_in_tree');
            $c = $modx->newQuery($classKey);
            $resourceId = $resource->get('id');
            $c->where(array(
                'parent' => $resourceId,
            ));
            $c->limit(21);
            $numChildren = $modx->getCount($classKey, $c);
            if ($numChildren > 20) {
                return;
            }
            if ($classKey !== 'GridContainer' &&
                    $isHideChildren == 1
            ) {
                $properties = $resource->get('properties');
                if ($properties['gridclasskey'] || empty($properties['gridclasskey'])) {
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
        $parentResource = $modx->getObject('modResource', intval($_GET['parent']));
        if (!$parentResource) {
            return;
        }
        $parent = $parentResource->toArray();
        if ($parent['class_key'] === 'GridContainer') {
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
                    } elseif ($key === 'content_dispo' || $key === 'isfolder' || $key === 'syncsite') {
                        // no place to override
                    } else {
                        $modx->_userConfig[$key . '_default'] = $v;
                    }
                }
            }
        }

        break;
    case 'OnDocFormPrerender':
        $actionId = intval($_GET['a']);
        if ($actionId !== 30 && $actionId !== 55) {
            return false;
        }
        $docId = isset($_GET['id']) ? intval($_GET['id']) : '';
        $parentId = isset($_GET['parent']) ? intval($_GET['parent']) : '';
        if (empty($docId) && empty($parentId)) {
            return false;
        }
        $resource = $modx->getObject('modResource', $docId);
        if ($resource) {
            if (!empty($docId)) {
                $classKey = $resource->get('class_key');
                if ($classKey === 'GridContainer') {
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
        if ($parentResource) {
            $parentClassKey = $parentResource->get('class_key');
            if ($parentClassKey === 'GridContainer') {
                $modx->lexicon->load('gridclasskey:default');
                $parentProperties = $parentResource->getProperties('gridclasskey');
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
            }
        }

    break;
    default:
        break;
}

return;