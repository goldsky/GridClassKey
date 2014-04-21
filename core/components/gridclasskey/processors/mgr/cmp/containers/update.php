<?php

$resource = $modx->getObject('modResource', $scriptProperties['id']);
if (!$resource) {
    return $this->failure('Resource was not found');
}
$settings = array();
foreach ($scriptProperties as $k => $v) {
    if (substr($k, 0, 22) == 'gridclasskey-property-') {
        $key = substr($k, 22);
        if ($v === 'false') {
            $v = 0;
        } elseif ($v === 'true') {
            $v = 1;
        }
        if ($key === 'fields') {
            $v = json_decode($v, TRUE);
        }
        $settings[$key] = $v;
    }
}
$resource->setProperties($settings, 'gridclasskey');
$resource->save();
return $this->success();