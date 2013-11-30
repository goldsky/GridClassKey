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
                id: 'gridclasskey-children-panel'
                , title: _('gridclasskey.children')
                , cls: 'modx-resource-tab'
                , layout: 'fit'
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
        if (config.show_tvs && MODx.config.tvs_below_content == 1) {
            its.push(this.getTemplateVariablesPanel(config));
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
    },
    getSettingFields: function(config) {
        config = config || {record: {}};

        var s = [{
                layout: 'column'
                , border: false
                , anchor: '100%'
                , defaults: {
                    labelSeparator: ''
                    , labelAlign: 'top'
                    , border: false
                    , layout: 'form'
                    , msgTarget: 'under'
                }
                , items: [
                    {
                        columnWidth: .5
                        , id: 'modx-page-settings-left'
                        , defaults: {msgTarget: 'under'}
                        , items: this.getSettingLeftFields(config)
                    }, {
                        columnWidth: .5
                        , id: 'modx-page-settings-right'
                        , defaults: {msgTarget: 'under'}
                        , items: this.getSettingRightFields(config)
                    }, {
                        columnWidth: .5
                        , title: _('gridclasskey.settings_grid')
                        , defaults: {msgTarget: 'under'}
                        , items: this.getGridSettingsLeftFields(config)
                    }, {
                        columnWidth: .5
                        , title: _('gridclasskey.settings_children')
                        , defaults: {msgTarget: 'under'}
                        , items: this.getGridSettingsRightFields(config)
                    }, {
                        columnWidth: 1
                        , title: _('gridclasskey.fields')
                        , defaults: {msgTarget: 'under'}
                        , items: this.getGridSettingsBottomFields(config)
                    }
                ]
            }];
        return s;
    },
    getGridSettingsLeftFields: function(config) {
        return [
            {
                xtype: 'textfield'
                , anchor: '100%'
                , name: 'gridclasskey-property-grid-css'
                , fieldLabel: _('gridclasskey.mgr_css')
                , description: _('gridclasskey.mgr_css_desc')
            }
        ];
    },
    getGridSettingsRightFields: function(config) {
        return [
            {
                xtype: 'modx-combo-template'
                , anchor: '100%'
                , name: 'gridclasskey-property-childtemplate'
                , hiddenName: 'gridclasskey-property-childtemplate'
                , fieldLabel: _('gridclasskey.default_template')
                , description: _('gridclasskey.child_default_template_desc')
                , bodyStyle: 'margin: 5px 0'
            }
        ];
    },
    getGridSettingsBottomFields: function(config) {
        return [
            {
                layout: 'column'
                , border: false
                , anchor: '100%'
                , defaults: {
                    labelSeparator: ''
                    , labelAlign: 'top'
                    , border: false
//                    , layout: 'form'
                    , msgTarget: 'under'
                }
                , items: [
                    {
                        columnWidth: .5
                        , xtype: 'gridclasskey-panel-mainfieldscombo'
                        , border: false
                        , bodyStyle: 'margin: 5px 0'
                    }, {
                        columnWidth: .5
                        , xtype: 'gridclasskey-panel-tvfieldscombo'
                        , border: false
                        , bodyStyle: 'margin: 5px 0'
                    }, {
                        // will be used for the grid below on submission
                        xtype: 'hidden',
                        name: 'gridclasskey-property-fields'
                    }, {
                        columnWidth: 1
                        , xtype: 'gridclasskey-grid-gridsettings'
                        , description: _('gridclasskey.fields_desc')
                    }
                ]
            }
        ];
    },
    beforeSubmit: function(o) {
        var grid = Ext.getCmp('gridclasskey-grid-gridsettings');
        var store = grid.getStore();
        var fields = [];
        for (var i = 0, l = store.data.items.length; i < l; i++) {
            fields.push({
                field: store.data.items[i].data.field,
                lexicon: store.data.items[i].data.lexicon,
                width: store.data.items[i].data.width,
                sortable: store.data.items[i].data.sortable,
                editor_type: store.data.items[i].data.editor_type
            });
        }
        var values = o.form.getValues();
        values['gridclasskey-property-fields'] = JSON.stringify(fields);
        o.form.setValues(values);
        return GridClassKey.panel.Container.superclass.beforeSubmit.call(this, o);
    }
});
Ext.reg('gridclasskey-panel-container', GridClassKey.panel.Container);