<?php

/**
 * GridClassKey
 *
 * Copyright 2013 - 2016 by goldsky <goldsky@virtudraft.com>
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
// Apache's timeout: 600 secs
if (function_exists('ini_get') && !ini_get('safe_mode')) {
    if (function_exists('set_time_limit')) {
        set_time_limit(600);
    }
    if (function_exists('ini_set')) {
        if (ini_get('max_execution_time') !== 600) {
            ini_set('max_execution_time', 600);
        }
    }
}

if (!isset($scriptProperties['action-parent']) || empty($scriptProperties['action-parent'])) {
    return $this->failure(__LINE__ . ': ' . $modx->lexicon('gridclasskey.empty_return_err'));
}
if (empty($scriptProperties['action-hidemenu']) &&
        empty($scriptProperties['action-publish']) &&
        empty($scriptProperties['action-delete']) &&
        empty($scriptProperties['action-change-template'])
) {
    return $this->failure($modx->lexicon('gridclasskey.empty_action_err'));
}
$ids = NULL;
if ($scriptProperties['action-range'] === 'selected') {
    if (empty($scriptProperties['action-range'])) {
        return $this->failure($modx->lexicon('gridclasskey.selection_err'));
    } else {
        $ids = json_decode($scriptProperties['action-selected-range'], 1);
        if (empty($ids)) {
            return $this->failure(__LINE__ . ': ' . $modx->lexicon('gridclasskey.empty_return_err'));
        }
    }
}

$c = $modx->newQuery('modResource');
$c->where(array(
    'parent:=' => $scriptProperties['action-parent']
));
if (!empty($ids)) {
    $c->where(array(
        'id:IN' => $ids
    ));
}
$total = $modx->getCount('modResource', $c);
if (isset($scriptProperties['limit']) && !empty($scriptProperties['limit'])) {
    $c->limit($scriptProperties['limit'], (isset($scriptProperties['start']) && !empty($scriptProperties['start']) ? $scriptProperties['start'] : 0));
}
$collection = $modx->getCollection('modResource', $c);
if (!$collection) {
    return $this->failure(__LINE__ . ': ' . $modx->lexicon('gridclasskey.empty_return_err'));
}

$uId = $modx->user->get('id');
$count = 0;
foreach ($collection as $item) {
    if (!empty($scriptProperties['action-hidemenu'])) {
        if ($scriptProperties['action-hidemenu'] === 'hide') {
            $item->set('hidemenu', 1);
        } else {
            $item->set('hidemenu', 0);
        }
    }
    if (!empty($scriptProperties['action-publish'])) {
        if ($scriptProperties['action-publish'] === 'publish') {
            $item->set('published', 1);
            $item->set('publishedon', time());
            $item->set('publishedby', $uId);
        } else {
            $item->set('published', 0);
            $item->set('publishedon', '');
            $item->set('publishedby', '');
        }
    }
    if (!empty($scriptProperties['action-delete'])) {
        if ($scriptProperties['action-delete'] === 'delete') {
            $item->set('deleted', 1);
            $item->set('deletedon', time());
            $item->set('deletedby', $uId);
        } elseif ($scriptProperties['action-delete'] === 'undelete') {
            $item->set('deleted', 0);
            $item->set('deletedon', '');
            $item->set('deletedby', '');
        } elseif ($scriptProperties['action-delete'] === 'purge') {
            $item->remove();
            continue;
        }
    }
    if (!empty($scriptProperties['action-change-template'])) {
        $item->set('template', $scriptProperties['action-change-template']);
    }

    if ($item->save()) {
        /* empty cache */
        $cacheManager = $modx->getCacheManager();
        $contexts = array($item->get('context_key'));
        $cacheManager->refresh(array(
            'db' => array(),
            'auto_publish' => array('contexts' => $contexts),
            'context_settings' => array('contexts' => $contexts),
            'resource' => array('contexts' => $contexts),
        ));
        $count++;
    }
}

return json_encode(array(
    'success' => true,
    'total' => $total,
    'message' => $this->error,
    'totalUpdated' => $count,
    'nextStart' => intval($scriptProperties['start']) + intval($scriptProperties['limit']),
));