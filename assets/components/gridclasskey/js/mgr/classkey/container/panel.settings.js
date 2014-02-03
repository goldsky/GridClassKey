GridClassKey.panel.Settings = function(config) {
    config = config || {};

    Ext.apply(config, {
        id: 'gridclasskey-panel-settings'
        , forceLayout: true
        , deferredRender: false
        , collapsible: false
        , animCollapse: false
        , items: [
            {
                title: _('gridclasskey.fields')
                , defaults: {msgTarget: 'under'}
                , layout: 'anchor'
                , items: this.getGridSettingsFields(config)
                , bodyStyle: 'padding: 15px'
            }, {
                title: _('gridclasskey.settings_container')
                , defaults: {msgTarget: 'under'}
                , layout: 'form'
                , items: this.getGridSettingsContainer(config)
                , bodyStyle: 'padding: 15px'
            }, {
                title: _('gridclasskey.settings_children')
                , defaults: {msgTarget: 'under'}
                , layout: 'form'
                , items: this.getGridSettingsChildren(config)
                , bodyStyle: 'padding: 15px'
            }
        ]
    });
    GridClassKey.panel.Settings.superclass.constructor.call(this, config);
};

Ext.extend(GridClassKey.panel.Settings, MODx.Tabs, {
    getGridSettingsFields: function(config) {
        return [
            {
                layout: 'column'
                , border: false
                , anchor: '100%'
                , defaults: {
                    labelSeparator: ''
                    , labelAlign: 'top'
                    , border: false
                    , msgTarget: 'under'
                }
                , margins: 0
                , items: [
                    {
                        columnWidth: .5
                        , id: 'gridclasskey-panel-mainfieldscombo'
                        , xtype: 'gridclasskey-panel-mainfieldscombo'
                        , comboWidth: 180
                        , applyToGrid: 'gridclasskey-grid-gridsettings'
                        , border: false
                        , bodyStyle: 'margin: 5px 0'
                    }, {
                        columnWidth: .5
                        , id: 'gridclasskey-panel-tvfieldscombo'
                        , xtype: 'gridclasskey-panel-tvfieldscombo'
                        , applyToGrid: 'gridclasskey-grid-gridsettings'
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
                    }, {
                        columnWidth: .5
                        , border: false
                        , bodyStyle: 'margin: 5px 0'
                        , layout: 'column'
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
                                , items: [
                                    {
                                        xtype: 'modx-combo-boolean'
                                        , name: 'gridclasskey-property-grid-sortby'
                                        , fieldLabel: _('sort_by')
                                        , store: new Ext.data.ArrayStore({
                                            fields: ['sort']
                                            , data: [['id'], ['pagetitle'], ['menuindex']]
                                        })
                                        , displayField: 'sort'
                                        , valueField: 'sort'
                                        , listeners: {
                                            change: {
                                                fn: function( cmp, newValue, oldValue ){
                                                    var btn = Ext.getCmp('modx-abtn-save');
                                                    if (btn) {
                                                        btn.enable();
                                                    }
                                                }
                                                , scope: this
                                            }
                                        }
                                    }
                                ]
                            }, {
                                columnWidth: .5
                                , items: [
                                    {
                                        xtype: 'modx-combo-boolean'
                                        , name: 'gridclasskey-property-grid-sortdir'
                                        , fieldLabel: _('gridclasskey.sort_dir')
                                        , store: new Ext.data.ArrayStore({
                                            fields: ['dir']
                                            , data: [['asc'], ['desc']]
                                        })
                                        , displayField: 'dir'
                                        , valueField: 'dir'
                                        , listeners: {
                                            change: {
                                                fn: function( cmp, newValue, oldValue ){
                                                    var btn = Ext.getCmp('modx-abtn-save');
                                                    if (btn) {
                                                        btn.enable();
                                                    }
                                                }
                                                , scope: this
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    },
    getGridSettingsContainer: function(config) {
        return [
            {
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
                , margins: 0
                , items: [
                    {
                        columnWidth: .5
                        , items: [
                            {
                                xtype: 'textfield'
                                , anchor: '100%'
                                , name: 'gridclasskey-property-grid-css'
                                , fieldLabel: _('gridclasskey.mgr_css')
                                , description: _('gridclasskey.mgr_css_desc')
                                , listeners: {
                                    change: {
                                        fn: function( cmp, newValue, oldValue ){
                                            var btn = Ext.getCmp('modx-abtn-save');
                                            if (btn) {
                                                btn.enable();
                                            }
                                        }
                                        , scope: this
                                    }
                                }
                            }, {
                                xtype: 'textfield'
                                , anchor: '100%'
                                , name: 'gridclasskey-property-grid-top-js'
                                , fieldLabel: _('gridclasskey.mgr_top_js')
                                , description: _('gridclasskey.mgr_top_js_desc')
                                , listeners: {
                                    change: {
                                        fn: function( cmp, newValue, oldValue ){
                                            var btn = Ext.getCmp('modx-abtn-save');
                                            if (btn) {
                                                btn.enable();
                                            }
                                        }
                                        , scope: this
                                    }
                                }
                            }, {
                                xtype: 'textfield'
                                , anchor: '100%'
                                , name: 'gridclasskey-property-grid-bottom-js'
                                , fieldLabel: _('gridclasskey.mgr_bottom_js')
                                , description: _('gridclasskey.mgr_bottom_js_desc')
                                , listeners: {
                                    change: {
                                        fn: function( cmp, newValue, oldValue ){
                                            var btn = Ext.getCmp('modx-abtn-save');
                                            if (btn) {
                                                btn.enable();
                                            }
                                        }
                                        , scope: this
                                    }
                                }
                            }
                        ]
                    }, {
                        columnWidth: .5
                        , items: [
                            {
                                xtype: 'textfield'
                                , anchor: '100%'
                                , id: 'gridclasskey-property-grid-childrentab-text'
                                , name: 'gridclasskey-property-grid-childrentab-text'
                                , fieldLabel: _('gridclasskey.childrentab_text')
                                , description: _('gridclasskey.childrentab_text_desc')
                                , listeners: {
                                    change: {
                                        fn: function( cmp, newValue, oldValue ){
                                            var btn = Ext.getCmp('modx-abtn-save');
                                            if (btn) {
                                                btn.enable();
                                            }
                                        }
                                        , scope: this
                                    }
                                }
                            }, {
                                xtype: 'textfield'
                                , anchor: '100%'
                                , id: 'gridclasskey-property-grid-addnewdocbtn-text'
                                , name: 'gridclasskey-property-grid-addnewdocbtn-text'
                                , fieldLabel: _('gridclasskey.addnewdocbtn_text')
                                , description: _('gridclasskey.addnewdocbtn_text_desc')
                                , listeners: {
                                    change: {
                                        fn: function( cmp, newValue, oldValue ){
                                            var btn = Ext.getCmp('modx-abtn-save');
                                            if (btn) {
                                                btn.enable();
                                            }
                                        }
                                        , scope: this
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ];
    },
    getGridSettingsChildren: function(config) {
        return [
            {
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
                , margins: 0
                , items: [
                    {
                        columnWidth: .5
                        , items: [
                            {
                                xtype: 'gridclasskey-combo-template'
                                , anchor: '100%'
                                , name: 'gridclasskey-property-child-template'
                                , hiddenName: 'gridclasskey-property-child-template'
                                , fieldLabel: _('gridclasskey.default_template')
                                , description: _('gridclasskey.child_default_template_desc')
                                , bodyStyle: 'margin: 5px 0'
                                , listeners: {
                                    change: {
                                        fn: function( cmp, newValue, oldValue ){
                                            var btn = Ext.getCmp('modx-abtn-save');
                                            if (btn) {
                                                btn.enable();
                                            }
                                        }
                                        , scope: this
                                    }
                                }
                            }, {
                                xtype: 'checkbox' // 'xcheckbox' fails to get the value for some reason
                                , hideLabel: true
                                , boxLabel: _('resource_hide_from_menus')
                                , id: 'gridclasskey-property-child-hidemenu'
                                , name: 'gridclasskey-property-child-hidemenu'
                                , description: _('resource_hide_from_menus_help')
                                , inputValue: 1
                                , checked: parseInt(config.record['gridclasskey-property-child-hidemenu']) || 0
                                , listeners: {
                                    change: {
                                        fn: function( cmp, newValue, oldValue ){
                                            var btn = Ext.getCmp('modx-abtn-save');
                                            if (btn) {
                                                btn.enable();
                                            }
                                        }
                                        , scope: this
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ];
    }
});
Ext.reg('gridclasskey-panel-settings', GridClassKey.panel.Settings);