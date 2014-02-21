<?php
/**
 * Grid Class Key
 *
 * Copyright 2013 - 2014 by goldsky <goldsky@virtudraft.com>
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
            if ($classKey !== 'GridContainer' &&
                    $isHideChildren === 1 &&
                    $classKey === 'modResource' ||
                    $classKey === 'modDocument' ||
                    $classKey === 'modStaticResource' ||
                    $classKey === 'modSymLink' ||
                    $classKey === 'modWebLink'
            ) {
                $properties = $resource->getProperties('gridclasskey');
                if ($properties) {
                    $resource->set('hide_children_in_tree', 0);
                    $resource->save();
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
        if (!empty($docId)) {
            $resource = $modx->getObject('modResource', $docId);
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

        $parentResource = $modx->getObject('modResource', $parentId);
        if ($parentResource) {
            $parentClassKey = $parentResource->get('class_key');
            if ($parentClassKey === 'GridContainer') {
                $modx->lexicon->load('gridclasskey:default');
                $text = $modx->lexicon('gridclasskey.back_to_container');
                $modx->regClientStartupHTMLBlock('<script type="text/javascript">
Ext.onReady(function() {
    var actionButtons = Ext.getCmp("modx-action-buttons");
    if (actionButtons) {
        var backToParentBtn = {
            xtype: "button"
            , text: "' . $text . '"
            , margins: "0 5 0 0"
            , handler: function() {
                Ext.getCmp("modx-resource-tree").loadAction(
                        "a=" + MODx.action["resource/update"]
                        + "&id=" + ' . $parentId . '
                        );
            }
        };
        actionButtons.insert(0, backToParentBtn);
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
