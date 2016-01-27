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
require_once MODX_CORE_PATH . 'model/modx/processors/resource/updatefromgrid.class.php';

class GridContainerUpdateFromGridProcessor extends modResourceUpdateFromGridProcessor {

    protected $selectedTVFields = array();

    /**
     * Override in your derivative class to do functionality after save() is run
     * @return boolean
     */
    public function afterSave() {
        $props = $this->getProperties();
        unset($props['action'], $props['has_children'], $props['action_edit'], $props['preview_url'], $props['menu'], $props['clearCache']);
        $mainFields = $this->modx->getSelectColumns('modResource');
        $mainFields = str_replace('`', '', $mainFields);
        $mainFields = array_map('trim', @explode(',', $mainFields));
        $this->selectedTVFields = array_diff(array_keys($props), $mainFields);

        foreach ($this->selectedTVFields as $tvName) {
            $tv = $this->modx->getObject('modTemplateVar', array(
                'name' => $tvName,
            ));
            if (!$tv) {
                continue;
            }

            /**
             * @see modResourceUpdateProcessor::saveTemplateVariables()
             */
            if (!$tv->checkResourceGroupAccess()) {
                continue;
            }

            $tvKey = 'tv' . $tv->get('id');
            // --- MODIFIED for GCK
            $value = $props[$tvName];
            /* set value of TV */
            if ($tv->get('type') != 'checkbox') {
                $value = $value !== null ? $value : $tv->get('default_text');
            } else {
                $value = $value ? $value : '';
            }

            /* validation for different types */
            switch ($tv->get('type')) {
                case 'url':
                    $prefix = $this->getProperty($tvKey . '_prefix', '');
                    if ($prefix != '--') {
                        $value = str_replace(array('ftp://', 'http://'), '', $value);
                        $value = $prefix . $value;
                    }
                    break;
                case 'date':
                    $value = empty($value) ? '' : strftime('%Y-%m-%d %H:%M:%S', strtotime($value));
                    break;
                /* ensure tag types trim whitespace from tags */
                case 'tag':
                case 'autotag':
                    // --- MODIFIED for GCK
                    $value = array_map('trim', @explode(',', $value));
                    $value = @implode(',', $value);
                    break;
                default:
                    /* handles checkboxes & multiple selects elements */
                    if (is_array($value)) {
                        $featureInsert = array();
                        while (list($featureValue, $featureItem) = each($value)) {
                            if (empty($featureItem)) {
                                continue;
                            }
                            $featureInsert[count($featureInsert)] = $featureItem;
                        }
                        $value = implode('||', $featureInsert);
                    }
                    // --- MODIFIED for GCK
                    else {
                        $value = str_replace(',', '||', $value);
                        // getting values from 'default' output
                        $value = array_map('trim', @explode('||', $value));
                        $value = array_unique($value);
                        $value = @implode('||', $value);
                    }
                    break;
            }

            /* if different than default and set, set TVR record */
            $default = $tv->processBindings($tv->get('default_text'), $this->object->get('id'));
            if (strcmp($value, $default) != 0) {
                /* update the existing record */
                $tvc = $this->modx->getObject('modTemplateVarResource', array(
                    'tmplvarid' => $tv->get('id'),
                    'contentid' => $this->object->get('id'),
                ));
                if ($tvc == null) {
                    /** @var modTemplateVarResource $tvc add a new record */
                    $tvc = $this->modx->newObject('modTemplateVarResource');
                    $tvc->set('tmplvarid', $tv->get('id'));
                    $tvc->set('contentid', $this->object->get('id'));
                }
                $tvc->set('value', $value);
                $tvc->save();

                /* if equal to default value, erase TVR record */
            } else {
                $tvc = $this->modx->getObject('modTemplateVarResource', array(
                    'tmplvarid' => $tv->get('id'),
                    'contentid' => $this->object->get('id'),
                ));
                if (!empty($tvc)) {
                    $tvc->remove();
                }
            }
        }

        return true;
    }

    /**
     * Return the success message
     * @return array
     */
    public function cleanup() {
        $resourceArray = $this->object->toArray();
        $parentProperties = $this->object->getOne('Parent')->getProperties('gridclasskey');

        if ($parentProperties) {
            $selectedFields = array();
            foreach ($parentProperties['fields'] as $field) {
                $selectedFields = array_merge($selectedFields, (array) $field['name']);
            }
        } else {
            $selectedFields = array('id', 'pagetitle', 'longtitle', 'description', 'deleted', 'published', 'hidemenu');
        }

        foreach ($resourceArray as $field => $value) {
            if (!in_array($field, $selectedFields) &&
                    $field !== 'published' &&
                    $field !== 'deleted' &&
                    $field !== 'hidemenu' &&
                    $field !== 'context_key' &&
                    $field !== 'isfolder'
            ) {
                unset($resourceArray[$field]);
                continue;
            }
            // avoid null on returns
            $resourceArray[$field] = $resourceArray[$field] !== null ? $resourceArray[$field] : '';
        }

        if (!empty($this->selectedTVFields)) {
            foreach ($this->selectedTVFields as $tv) {
                $matches = null;
                preg_match('/(.*)_output/', $tv, $matches);
                if (!empty($matches)) {
                    $resourceArray[$matches[1] . '_output'] = $this->object->getTVValue($matches[1]);
                }
            }
        }

        return $this->success('', $resourceArray);
    }

}

return 'GridContainerUpdateFromGridProcessor';