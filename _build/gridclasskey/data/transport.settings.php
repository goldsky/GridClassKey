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
 * GridClassKey build script
 *
 * @package gridclasskey
 * @subpackage build
 */
$settings['gridclasskey.core_path'] = $modx->newObject('modSystemSetting');
$settings['gridclasskey.core_path']->fromArray(array(
    'key' => 'gridclasskey.core_path',
    'value' => '{core_path}components/gridclasskey/',
    'xtype' => 'textfield',
    'namespace' => 'gridclasskey',
    'area' => 'URL',
        ), '', true, true);

$settings['gridclasskey.assets_url'] = $modx->newObject('modSystemSetting');
$settings['gridclasskey.assets_url']->fromArray(array(
    'key' => 'gridclasskey.assets_url',
    'value' => '{assets_url}components/gridclasskey/',
    'xtype' => 'textfield',
    'namespace' => 'gridclasskey',
    'area' => 'URL',
        ), '', true, true);

$settings['gridclasskey.mgr_css'] = $modx->newObject('modSystemSetting');
$settings['gridclasskey.mgr_css']->fromArray(array(
    'key' => 'gridclasskey.mgr_css',
    'value' => '',
    'xtype' => 'textfield',
    'namespace' => 'gridclasskey',
    'area' => 'file',
        ), '', true, true);

$settings['gridclasskey.unhide_children_in_tree_limit'] = $modx->newObject('modSystemSetting');
$settings['gridclasskey.unhide_children_in_tree_limit']->fromArray(array(
    'key' => 'gridclasskey.unhide_children_in_tree_limit',
    'value' => 20,
    'xtype' => 'textfield',
    'namespace' => 'gridclasskey',
    'area' => 'manager',
        ), '', true, true);

$settings['mgr_tree_icon_gridcontainer'] = $modx->newObject('modSystemSetting');
$settings['mgr_tree_icon_gridcontainer']->fromArray(array(
    'key' => 'mgr_tree_icon_gridcontainer',
    'value' => 'icon-list',
    'xtype' => 'textfield',
    'namespace' => 'gridclasskey',
    'area' => 'manager',
        ), '', true, true);

$settings['mgr_tree_icon_staticgridcontainer'] = $modx->newObject('modSystemSetting');
$settings['mgr_tree_icon_staticgridcontainer']->fromArray(array(
    'key' => 'mgr_tree_icon_staticgridcontainer',
    'value' => 'icon-list-alt',
    'xtype' => 'textfield',
    'namespace' => 'gridclasskey',
    'area' => 'manager',
        ), '', true, true);

return $settings;
