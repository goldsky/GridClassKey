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
 * Resolve System Settings Data
 *
 * @package gridclasskey
 * @subpackage build
 */
if ($modx = & $object->xpdo) {
    // http://forums.modx.com/thread/88734/package-version-check#dis-post-489104
    $c = $modx->newQuery('transport.modTransportPackage');
    $c->where(array(
        'workspace' => 1,
        "(SELECT
            `signature`
          FROM {$modx->getTableName('modTransportPackage')} AS `latestPackage`
          WHERE `latestPackage`.`package_name` = `modTransportPackage`.`package_name`
          ORDER BY
             `latestPackage`.`version_major` DESC,
             `latestPackage`.`version_minor` DESC,
             `latestPackage`.`version_patch` DESC,
             IF(`release` = '' OR `release` = 'ga' OR `release` = 'pl','z',`release`) DESC,
             `latestPackage`.`release_index` DESC
          LIMIT 1,1) = `modTransportPackage`.`signature`",
    ));
    $c->where(array(
        'modTransportPackage.signature:LIKE' => '%gridclasskey%',
        'OR:modTransportPackage.package_name:LIKE' => '%gridclasskey%',
        'OR:modTransportPackage.package_name:LIKE' => '%grid class key%',
        'installed:IS NOT' => null
    ));
    $oldPackage = $modx->getObject('transport.modTransportPackage', $c);

    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
            $modx->addExtensionPackage('gridclasskey', '[[++core_path]]components/gridclasskey/model/');
            break;
        case xPDOTransport::ACTION_UPGRADE:
            if ($oldPackage && $oldPackage->compareVersion('1.0.0-rc3', '>')) {
                $oldPlugin = $modx->getObject('modPlugin', array('name' => 'Grid Class Key'));
                $newPlugin = $modx->getObject('modPlugin', array('name' => 'GridClassKey'));
                if ($oldPlugin) {
                    if ($newPlugin) {
                        $oldPlugin->remove();
                    } else {
                        $oldPlugin->set('name', 'GridClassKey');
                        $oldPlugin->save();
                    }
                }
                $oldCategory = $modx->getObject('modCategory', array('category' => 'Grid Class Key'));
                $newCategory = $modx->getObject('modCategory', array('category' => 'GridClassKey'));
                if ($oldCategory) {
                    if ($newCategory) {
                        $oldCategory->remove();
                    } else {
                        $oldCategory->set('category', 'GridClassKey');
                        $oldCategory->save();
                    }
                }
                $workspaces = $modx->getCollection('modWorkspace');
                foreach ($workspaces as $workspace) {
                    $packages = $workspace->getMany('Packages', array('package_name' => 'Grid Class Key'));
                    if ($packages) {
                        foreach ($packages as $package) {
                            $package->set('package_name', 'GridClassKey');
                            $package->save();
                        }
                    }
                }  
            }
            break;
        case xPDOTransport::ACTION_UNINSTALL:
            $modx->removeExtensionPackage('gridclasskey');
            break;
    }
}

return true;
