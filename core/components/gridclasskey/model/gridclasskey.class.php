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
 * GridClassKey main class
 *
 * @package gridclasskey
 * @subpackage controller
 */
class GridClassKey {

    const VERSION = '1.0.2';
    const RELEASE = 'pl';

    /**
     * modX object
     * @var object
     */
    public $modx;

    /**
     * $scriptProperties
     * @var array
     */
    public $config;

    /**
     * constructor
     * @param   modX    $modx
     * @param   array   $config     parameters
     */
    public function __construct(modX $modx, $config = array()) {
        $this->modx = & $modx;
        $config = is_array($config) ? $config : array();
        $basePath = $this->modx->getOption('gridclasskey.core_path', $config, $this->modx->getOption('core_path') . 'components/gridclasskey/');
        $assetsUrl = $this->modx->getOption('gridclasskey.assets_url', $config, $this->modx->getOption('assets_url') . 'components/gridclasskey/');
        $this->config = array_merge(array(
            'version' => self::VERSION . '-' . self::RELEASE,
            'basePath' => $basePath,
            'corePath' => $basePath,
            'modelPath' => $basePath . 'model/',
            'processorsPath' => $basePath . 'processors/',
            'chunksPath' => $basePath . 'elements/chunks/',
            'templatesPath' => $basePath . 'templates/',
            'jsUrl' => $assetsUrl . 'js/',
            'cssUrl' => $assetsUrl . 'css/',
            'assetsUrl' => $assetsUrl,
            'connectorUrl' => $assetsUrl . 'connector.php',
                ), $config);

        $this->modx->lexicon->load('gridclasskey:default');
        $this->modx->addPackage('gridclasskey', $this->config['modelPath']);
    }

}
