<?php

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
