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
 * @subpackage elements
 */
switch ($modx->event->name) {
    case 'OnManagerPageInit':
        $cssFile = $modx->getOption('gridclasskey.assets_url', null, $modx->getOption('assets_url') . 'components/gridclasskey/') . 'css/mgr.css';
        $modx->regClientCSS($cssFile);
        $docId = intval($_GET['id']);
        if ($docId) {
            $properties = $modx->getObject('modResource', $docId)->getProperties('gridclasskey');
            if ($properties['grid-css']) {
                $modx->regClientCSS($properties['grid-css']);
            }
        }
        break;
    case 'OnDocFormSave':
        if ($mode === 'upd') {
            $classKey = $resource->get('class_key');
            $isHideChildren = $resource->get('hide_children_in_tree');
            if ($classKey !== 'GridContainer' &&
                    $isHideChildren !== 1 &&
                    $classKey === 'modResource' ||
                    $classKey === 'modDocument' ||
                    $classKey === 'modStaticResource' ||
                    $classKey === 'modSymLink' ||
                    $classKey === 'modWebLink'
                    ) {
                $resource->set('hide_children_in_tree', 0);
                $resource->save();
            }
        }
        break;

    default:
        break;
}

return;