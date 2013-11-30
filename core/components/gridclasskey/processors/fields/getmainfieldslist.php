<?php

$columns = $modx->getSelectColumns('modResource', '', '', array('id'), true);
$columns = str_replace('`', '', $columns);
$columns = @explode(',', $columns);
array_walk($columns, create_function('&$v', '$v = trim($v);'));

if ($columns) {
    sort($columns);
    foreach ($columns as $column) {
        $mainFields[] = array(
            'name' => $column
        );
    }
}

$results = array(
    'total' => count($mainFields),
    'results' => $mainFields
);

return json_encode($results);