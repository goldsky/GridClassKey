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
 * Auto-assign the GridClassKeyPolicy to the Administrator User Group
 *
 * @package gridclasskey
 * @subpackage build
 */
if ($object->xpdo) {
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            $modx = & $object->xpdo;
            $modelPath = $modx->getOption('gridclasskey.core_path', null, $modx->getOption('core_path') . 'components/gridclasskey/') . 'model/';
            $modx->addPackage('gridclasskey', $modelPath);

            $modx->setLogLevel(modX::LOG_LEVEL_ERROR);

            /* assign policy to template */
            $policy = $transport->xpdo->getObject('modAccessPolicy', array(
                'name' => 'GridClassKey'
            ));
            if ($policy) {
                $template = $transport->xpdo->getObject('modAccessPolicyTemplate', array('name' => 'GridClassKeyTemplate'));
                if ($template) {
                    $policy->set('template', $template->get('id'));
                    $policy->save();
                } else {
                    $modx->log(xPDO::LOG_LEVEL_ERROR, '[GridClassKey] Could not find GridClassKeyTemplate Access Policy Template!');
                }
            } else {
                $modx->log(xPDO::LOG_LEVEL_ERROR, '[GridClassKey] Could not find GridClassKey Access Policy!');
                break;
            }

            /* assign policy to admin group */
            $adminGroup = $modx->getObject('modUserGroup', array('name' => 'Administrator'));
            if ($policy && $adminGroup) {
                $params = array(
                    'target' => 'mgr',
                    'principal_class' => 'modUserGroup',
                    'principal' => $adminGroup->get('id'),
                    'authority' => 9999,
                    'policy' => $policy->get('id'),
                );
                $access = $modx->getObject('modAccessContext', $params);
                if (!$access) {
                    $access = $modx->newObject('modAccessContext');
                    $access->fromArray($params);
                    $access->save();
                }
            }
            $modx->setLogLevel(modX::LOG_LEVEL_INFO);
            break;
    }
}
return true;
