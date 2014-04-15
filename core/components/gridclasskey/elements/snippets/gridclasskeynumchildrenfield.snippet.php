<?php

/**
 * All row values are stored in $scriptProperties for the sake of similarity
 * 
 * @test
 * $modx->log(modX::LOG_LEVEL_ERROR, __LINE__ . ': $scriptProperties ' . print_r($scriptProperties, 1));
 */
$id = $modx->getOption('id', $scriptProperties);
if (empty($id)) {
    return 0;
}

return $modx->getCount('modResource', array('parent' => $id));