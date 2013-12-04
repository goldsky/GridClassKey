<?php

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

$collection = $modx->getCollection('modResource', $c);
if (!$collection) {
    return $this->failure(__LINE__ . ': ' . $modx->lexicon('gridclasskey.empty_return_err'));
}

$uId = $modx->user->get('id');
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
    $item->save();
}

return $this->success();
