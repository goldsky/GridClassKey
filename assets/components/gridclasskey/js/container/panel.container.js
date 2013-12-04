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
                id: 'gridclasskey-grid-children-panel'
                , title: config.record['gridclasskey-property-grid-childrentab-text'] || _('gridclasskey.children')
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
            xtype: 'gridclasskey-grid-children'
            , record: config.record
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
                        , title: _('gridclasskey.settings_container')
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
            }, {
                xtype: 'textfield'
                , anchor: '100%'
                , name: 'gridclasskey-property-grid-top-js'
                , fieldLabel: _('gridclasskey.mgr_top_js')
                , description: _('gridclasskey.mgr_top_js_desc')
            }, {
                xtype: 'textfield'
                , anchor: '100%'
                , name: 'gridclasskey-property-grid-bottom-js'
                , fieldLabel: _('gridclasskey.mgr_bottom_js')
                , description: _('gridclasskey.mgr_bottom_js_desc')
            }, {
                xtype: 'textfield'
                , anchor: '100%'
                , id: 'gridclasskey-property-grid-childrentab-text'
                , name: 'gridclasskey-property-grid-childrentab-text'
                , fieldLabel: _('gridclasskey.childrentab_text')
                , description: _('gridclasskey.childrentab_text_desc')
            }, {
                xtype: 'textfield'
                , anchor: '100%'
                , id: 'gridclasskey-property-grid-addnewdocbtn-text'
                , name: 'gridclasskey-property-grid-addnewdocbtn-text'
                , fieldLabel: _('gridclasskey.addnewdocbtn_text')
                , description: _('gridclasskey.addnewdocbtn_text_desc')
            }
        ];
    },
    getGridSettingsRightFields: function(config) {
        return [
            {
                xtype: 'gridclasskey-combo-template'
                , anchor: '100%'
                , name: 'gridclasskey-property-child-template'
                , hiddenName: 'gridclasskey-property-child-template'
                , fieldLabel: _('gridclasskey.default_template')
                , description: _('gridclasskey.child_default_template_desc')
                , bodyStyle: 'margin: 5px 0'
            }, {
                xtype: 'checkbox' // 'xcheckbox' fails to get the value for some reason
                , hideLabel: true
                , boxLabel: _('resource_hide_from_menus')
                , id: 'gridclasskey-property-child-hidemenu'
                , name: 'gridclasskey-property-child-hidemenu'
                , description: _('resource_hide_from_menus_help')
                , inputValue: 1
                , checked: parseInt(config.record['gridclasskey-property-child-hidemenu']) || 0
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
                        xtype: 'hidden'
                        , id: 'gridclasskey-property-fields'
                        , name: 'gridclasskey-property-fields'
                    }, {
                        columnWidth: 1
                        , xtype: 'gridclasskey-grid-gridsettings'
                        , description: _('gridclasskey.fields_desc')
                        , record: config.record
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
                name: store.data.items[i].data.name,
                lexicon: store.data.items[i].data.lexicon,
                width: store.data.items[i].data.width,
                sortable: store.data.items[i].data.sortable,
                hidden: store.data.items[i].data.hidden,
                editor_type: store.data.items[i].data.editor_type,
                output_filter: store.data.items[i].data.output_filter
            });
        }
        Ext.getCmp('gridclasskey-property-fields').setValue(JSON.stringify(fields));

        return GridClassKey.panel.Container.superclass.beforeSubmit.apply(this, arguments);
    },
    success: function(o) {
        var grid = Ext.getCmp('gridclasskey-grid-gridsettings');
        var store = grid.getStore();
        var fields = [];
        for (var i = 0, l = store.data.items.length; i < l; i++) {
            fields.push({
                name: store.data.items[i].data.name,
                lexicon: store.data.items[i].data.lexicon,
                width: store.data.items[i].data.width,
                sortable: store.data.items[i].data.sortable,
                hidden: store.data.items[i].data.hidden,
                editor_type: store.data.items[i].data.editor_type,
                output_filter: store.data.items[i].data.output_filter
            });
        }
        // upgrade differences
        this.config.record.properties = this.config.record.properties || {};
        this.config.record.properties.gridclasskey = this.config.record.properties.gridclasskey || {};

        this.config.record.properties.gridclasskey['fields'] = fields;

        var childrenTabText = Ext.getCmp('gridclasskey-property-grid-childrentab-text').getValue();
        if (childrenTabText) {
            this.config.record.properties.gridclasskey['grid-childrentab-text'] = childrenTabText;
            Ext.getCmp('gridclasskey-grid-children-panel').setTitle(childrenTabText);
        }

        var addNewDocText = Ext.getCmp('gridclasskey-property-grid-addnewdocbtn-text').getValue();
        if (addNewDocText) {
            this.config.record.properties.gridclasskey['grid-addnewdocbtn-text'] = addNewDocText;
            Ext.getCmp('gridclasskey-property-grid-addnewdocbtn').setTitle(childrenTabText);
        }

        var container = Ext.getCmp('gridclasskey-grid-children-panel');
        container.removeAll();
        container.add({
            xtype: 'gridclasskey-grid-children'
            , record: this.config.record
        });
        container.doLayout();

        return GridClassKey.panel.Container.superclass.success.call(this, o);
    }
});
Ext.reg('gridclasskey-panel-container', GridClassKey.panel.Container);