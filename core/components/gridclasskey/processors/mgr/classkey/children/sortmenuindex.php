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

/**
 * Clean up the sorting first
 */
$c = $modx->newQuery('modResource');
$c->where(array(
    'parent' => $scriptProperties['parent']
));
$c->sortby('menuindex', $scriptProperties['sortdir']);
$c->sortby('id', $scriptProperties['sortdir']);
$children = $modx->getCollection('modResource', $c);
if (!$children) {
    return $this->failure();
}
$i = 0;
$j = count($children) - 1;
foreach ($children as $child) {
    if ($scriptProperties['sortdir'] === 'asc') {
        $child->set('menuindex', $i);
        $i++;
    } else {
        $child->set('menuindex', $j);
        $j--;
    }
    $child->save();
}

$targetMenuindex = $modx->getObject('modResource', $scriptProperties['targetId'])->get('menuindex');
/**
 * Prepare the moving ids
 */
$movingIds = @explode(',', $scriptProperties['movingIds']);
$c = $modx->newQuery('modResource');
$c->where(array(
    'parent' => $scriptProperties['parent'],
    'id:IN' => $movingIds
));
$c->sortby('menuindex', $scriptProperties['sortdir']);
$c->sortby('id', $scriptProperties['sortdir']);
$movingRes = $modx->getCollection('modResource', $c);
$countMovingRes = count($movingRes);
foreach ($movingRes as $res) {
    $c = $modx->newQuery('modResource');
    $movingMenuindex = $res->get('menuindex');
    if ($movingMenuindex < $targetMenuindex) {
        $c->where(array(
            'parent' => $scriptProperties['parent'],
            'menuindex:>' => $movingMenuindex,
            'menuindex:<=' => $targetMenuindex,
        ));
    } else {
        $c->where(array(
            'parent' => $scriptProperties['parent'],
            'menuindex:<' => $movingMenuindex,
            'menuindex:>=' => $targetMenuindex,
        ));
    }
    $c->sortby('menuindex', $scriptProperties['sortdir']);
    $c->sortby('id', $scriptProperties['sortdir']);
    $affectedRes = $modx->getCollection('modResource', $c);
    foreach ($affectedRes as $affected) {
        $affectedMenuindex = $affected->get('menuindex');
        if ($movingMenuindex < $targetMenuindex) {
            $newIndex = $affectedMenuindex - 1;
        } else {
            $newIndex = $affectedMenuindex + 1;
        }
        $affected->set('menuindex', $newIndex);
        $affected->save();
    }
    $res->set('menuindex', $targetMenuindex);
    $res->save();
}

return $this->success();
