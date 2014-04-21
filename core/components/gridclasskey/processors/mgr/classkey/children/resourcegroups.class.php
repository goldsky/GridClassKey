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
 * @subpackage processor
 */

if (!class_exists('modResourceGroupResourceGetListProcessor')) {
    include_once MODX_CORE_PATH . 'model/modx/processors/resource/resourcegroup/getlist.class.php';
}

class ChildrenResourceGroupsGetListProcessor extends modResourceGroupResourceGetListProcessor {
   
    public function process() {
        $parentProcess = json_decode(parent::process(), 1);
        $list = $parentProcess['results'];
        $record = $this->getProperty('record');
        if (!empty($record)) {
            $childrenResourceGroups = json_decode($record, 1);

            $list = array();
            /** @var modResourceGroup $resourceGroup */
            foreach ($parentProcess['results'] as $result) {
                $result['access'] = (boolean) $result['access'];
                if (isset($childrenResourceGroups[$result['id']]) && !empty($childrenResourceGroups)) {
                    $result['access'] = (boolean) $childrenResourceGroups[$result['id']]['access'];
                }
                $list[] = $result;
            }
        }
        return $this->outputArray($list, $parentProcess['total']);
    }

}
return 'ChildrenResourceGroupsGetListProcessor';