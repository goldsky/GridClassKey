<?php

require_once MODX_CORE_PATH . 'model/modx/processors/element/template/getlist.class.php';

class GridTemplateGetListProcessor extends modTemplateGetListProcessor {

    /**
     * Can be used to insert a row after iteration
     * @param array $list
     * @return array
     */
    public function afterIteration(array $list) {
        $list = array_merge(array(array(
                'id' => null,
                'templatename' => '',
                'description' => '',
                'category_name' => ''
            )), $list);
        return $list;
    }

}

return 'GridTemplateGetListProcessor';
