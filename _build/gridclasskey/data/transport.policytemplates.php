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
 * GridClassKey build script
 *
 * @package gridclasskey
 * @subpackage build
 */

/**
 * Default GridClassKey Policy Templates
 *
 * @package gridclasskey
 * @subpackage build
 */
$templates = array();

/* administrator template/policy */
$templates['1']= $modx->newObject('modAccessPolicyTemplate');
$templates['1']->fromArray(array(
    'id' => 1,
    'name' => 'GridClassKeyTemplate',
    'description' => 'A policy template for GridClassKey containers.',
    'lexicon' => 'gridclasskey:permissions',
    'template_group' => 1,
));
$permissions = include dirname(__FILE__).'/permissions/gridclasskey.policy.php';
if (is_array($permissions)) {
    $templates['1']->addMany($permissions);
} else {
    $modx->log(modX::LOG_LEVEL_ERROR,'Could not load GridClassKey Policy Template.'); 
}

return $templates;