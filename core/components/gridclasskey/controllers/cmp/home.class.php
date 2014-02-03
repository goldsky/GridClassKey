<?php

class GridClassKeyCmpHomeManagerController extends GridClassKeyManagerController {

    public function process(array $scriptProperties = array()) {

    }

    public function getPageTitle() {
        return $this->modx->lexicon('gridclasskey');
    }

    public function loadCustomCssJs() {
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/panel.settings.js');
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/combo.template.js');
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/combo.tvfields.js');
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/panel.combo.tvfields.js');
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/combo.mainfields.js');
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/panel.combo.mainfields.js');
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/grid.gridsettings.js');
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/classkey/container/grid.children.js');

        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/cmp/widgets/window.setting.js');
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/cmp/widgets/grid.containers.js');
        $this->addJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/cmp/widgets/panel.home.js');
        $this->addLastJavascript($this->gridclasskey->config['jsUrl'] . 'mgr/cmp/sections/index.js');
    }

    public function getTemplateFile() {
        return $this->gridclasskey->config['templatesPath'] . 'home.tpl';
    }

}