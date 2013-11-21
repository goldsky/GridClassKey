GridClassKey.panel.Container = function(config) {
    config = config || {};
    GridClassKey.panel.Container.superclass.constructor.call(this, config);
};

Ext.extend(GridClassKey.panel.Container, MODx.panel.Resource, {
    getFields: function(config) {
        var it = [];
        // update
        if (config.record.id) {
            it.push({
                id: 'gridclasskey-children'
                , title: _('gridclasskey.children')
                , cls: 'modx-resource-tab'
                , layout: 'form'
                , forceLayout: true
                , deferredRender: false
                , labelWidth: 200
                , bodyCssClass: 'main-wrapper'
                , autoHeight: true
                , defaults: {
                    border: false
                    , msgTarget: 'under'
                }
                , items: this.getChildren(config)
            });
        }
        it.push({
            title: _('document')
            , id: 'modx-resource-settings'
            , cls: 'modx-resource-tab'
            , layout: 'form'
            , labelAlign: 'top'
            , labelSeparator: ''
            , bodyCssClass: 'tab-panel-wrapper main-wrapper'
            , autoHeight: true
            , defaults: {
                border: false
                , msgTarget: 'under'
                , width: 400
            }
            , items: this.getMainFields(config)
        });
        var ct = this.getContentField(config);
        if (ct) {
            it.push({
                title: _('resource_content')
                , id: 'modx-resource-content'
                , layout: 'form'
                , bodyCssClass: 'main-wrapper'
                , autoHeight: true
                , collapsible: true
                , animCollapse: false
                , hideMode: 'offsets'
                , items: ct
                , style: 'margin-top: 10px'
            });
        }
        it.push({
            id: 'modx-page-settings'
            , title: _('settings')
            , cls: 'modx-resource-tab'
            , layout: 'form'
            , forceLayout: true
            , deferredRender: false
            , labelWidth: 200
            , bodyCssClass: 'main-wrapper'
            , autoHeight: true
            , defaults: {
                border: false
                , msgTarget: 'under'
            }
            , items: this.getSettingFields(config)
        });
        if (config.show_tvs && MODx.config.tvs_below_content != 1) {
            it.push(this.getTemplateVariablesPanel(config));
        }
        if (MODx.perm.resourcegroup_resource_list == 1) {
            it.push(this.getAccessPermissionsTab(config));
        }
        var its = [];
        its.push(this.getPageHeader(config), {
            id: 'modx-resource-tabs'
            , xtype: 'modx-tabs'
            , forceLayout: true
            , deferredRender: false
            , collapsible: true
            , animCollapse: false
            , itemId: 'tabs'
            , items: it
        });
        if (MODx.config.tvs_below_content == 1) {
            var tvs = this.getTemplateVariablesPanel(config);
            its.push(tvs);
        }
        return its;
    },
    getPageHeader: function(config) {
        config = config || {record: {}};
        return {
            html: '<h2>' + _('gridclasskey.container_new') + '</h2>'
            , id: 'modx-resource-header'
            , cls: 'modx-page-header'
            , border: false
            , forceLayout: true
            , anchor: '100%'
        };
    },
    getChildren: function(config) {
        var items = [];
        items.push({
            xtype: 'gridclasskey-grid-children',
            record: config.record
        });
        return items;
    }
});
Ext.reg('gridclasskey-panel-container', GridClassKey.panel.Container);