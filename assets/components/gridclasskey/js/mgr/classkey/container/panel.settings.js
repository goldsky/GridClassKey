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
                        , xtype: 'buttongroup'
                        , title: _('sort_by')
                        , items: [
                            {
                                xtype: 'gridclasskey-combo-mainfields'
                                , id: 'gridclasskey-combo-mainfields-sortby'
                                , includeId: true
                                , listeners: {
                                    select: {
                                        fn: function(combo, record, index) {
                                            Ext.getCmp('gridclasskey-combo-tvfields-sortby').clearValue();
                                            Ext.getCmp('gridclasskey-property-grid-sortby').setValue(combo.getValue());
                                        },
                                        scope: this
                                    },
                                    change: {
                                        fn: function(cmp, newValue, oldValue) {
                                            var btn = Ext.getCmp('modx-abtn-save');
                                            if (btn) {
                                                btn.enable();
                                            }
                                        }
                                        , scope: this
                                    }
                                }
                            }, {
                                xtype: 'gridclasskey-combo-tvfields'
                                , id: 'gridclasskey-combo-tvfields-sortby'
                                , listeners: {
                                    select: {
                                        fn: function(combo, record, index) {
                                            Ext.getCmp('gridclasskey-combo-mainfields-sortby').clearValue();
                                            Ext.getCmp('gridclasskey-property-grid-sortby').setValue(record.data.name);
                                        },
                                        scope: this
                                    },
                                    change: {
                                        fn: function(cmp, newValue, oldValue) {
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
                        , xtype: 'buttongroup'
                        , title: _('gridclasskey.sort_dir')
                        , items: [
                            {
                                // will be used for the selection above on submission
                                xtype: 'textfield'
                                , id: 'gridclasskey-property-grid-sortby'
                                , name: 'gridclasskey-property-grid-sortby'
                                , value: config.record['gridclasskey-property-grid-sortby']
                                , readOnly: true
                            }, {
                                xtype: 'modx-combo-boolean'
                                , name: 'gridclasskey-property-grid-sortdir'
                                , width: 80
                                , listWidth: 60
                                , store: new Ext.data.ArrayStore({
                                    fields: ['dir']
                                    , data: [['asc'], ['desc']]
                                })
                                , displayField: 'dir'
                                , valueField: 'dir'
                                , listeners: {
                                    change: {
                                        fn: function(cmp, newValue, oldValue) {
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
                                        fn: function(cmp, newValue, oldValue) {
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
                                        fn: function(cmp, newValue, oldValue) {
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
                                        fn: function(cmp, newValue, oldValue) {
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
                                        fn: function(cmp, newValue, oldValue) {
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
                                        fn: function(cmp, newValue, oldValue) {
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
                        , defaults: {
                            listeners: {
                                change: {
                                    fn: function(cmp, newValue, oldValue) {
                                        var btn = Ext.getCmp('modx-abtn-save');
                                        if (btn) {
                                            btn.enable();
                                        }
                                    }
                                    , scope: this
                                }
                            }
                        }
                        , items: [
                            {
                                xtype: 'textfield'
                                , anchor: '100%'
                                , name: 'gridclasskey-property-child-backbutton-text'
                                , fieldLabel: _('gridclasskey.backbutton_text')
                                , description: _('gridclasskey.backbutton_text_desc')
                                , listeners: {
                                    change: {
                                        fn: function(cmp, newValue, oldValue) {
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
                        columnWidth: 1
                        , items: [
                            {
                                html: '<p>' + _('gridclasskey.children_settings_desc') + '</p>'
                                , bodyCssClass: 'panel-desc'
                            }
                        ]
                    }, {
                        columnWidth: .5
                        , defaults: {
                            listeners: {
                                change: {
                                    fn: function(cmp, newValue, oldValue) {
                                        var btn = Ext.getCmp('modx-abtn-save');
                                        if (btn) {
                                            btn.enable();
                                        }
                                    }
                                    , scope: this
                                }
                            }
                        }
                        , items: [
                            {
                                xtype: 'gridclasskey-combo-template'
                                , anchor: '100%'
                                , name: 'gridclasskey-property-child-template'
                                , hiddenName: 'gridclasskey-property-child-template'
                                , fieldLabel: _('gridclasskey.default_template')
                                , description: _('gridclasskey.child_default_template_desc')
                                , bodyStyle: 'margin: 5px 0'
                            }, {
                                xtype: 'modx-combo-class-derivatives'
                                , fieldLabel: _('resource_type')
                                , description: '<b>[[*class_key]]</b><br />'
                                , name: 'gridclasskey-property-child-class_key'
                                , hiddenName: 'gridclasskey-property-child-class_key'
                                , allowBlank: true
                                , value: config.record['gridclasskey-property-child-class_key'] || 'modDocument'
                                , anchor: '100%'
                            }, {
                                xtype: 'modx-combo-content-type'
                                , fieldLabel: _('resource_content_type')
                                , description: '<b>[[*content_type]]</b><br />' + _('resource_content_type_help')
                                , name: 'gridclasskey-property-child-content_type'
                                , hiddenName: 'gridclasskey-property-child-content_type'
                                , anchor: '100%'
                                , value: config.record['gridclasskey-property-child-content_type'] || (MODx.config.default_content_type || 1)
                            }/*, {
                             xtype: 'modx-combo-content-disposition'
                             , fieldLabel: _('resource_contentdispo')
                             , description: '<b>[[*content_dispo]]</b><br />' + _('resource_contentdispo_help')
                             , name: 'gridclasskey-property-child-content_dispo'
                             , hiddenName: 'gridclasskey-property-child-content_dispo'
                             , anchor: '100%'
                             , value: config.record['gridclasskey-property-child-content_dispo'] || 0
                             }*/
                        ]
                    }, {
                        columnWidth: .5
                        , items: [
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
                                        , defaults: {
                                            listeners: {
                                                change: {
                                                    fn: function(cmp, newValue, oldValue) {
                                                        var btn = Ext.getCmp('modx-abtn-save');
                                                        if (btn) {
                                                            btn.enable();
                                                        }
                                                    }
                                                    , scope: this
                                                }
                                            }
                                        }
                                        , items: [
                                            {
                                                xtype: 'checkbox' // 'xcheckbox' fails to get the value for some reason
                                                , hideLabel: true
                                                , boxLabel: _('resource_hide_from_menus')
                                                , id: 'gridclasskey-property-child-hidemenu'
                                                , name: 'gridclasskey-property-child-hidemenu'
                                                , description: _('resource_hide_from_menus_help')
                                                , inputValue: 1
                                                , checked: parseInt(config.record['gridclasskey-property-child-hidemenu']) || 0
                                            }, /*{
                                             xtype: 'checkbox'
                                             , boxLabel: _('resource_folder')
                                             , description: '<b>[[*isfolder]]</b><br />' + _('resource_folder_help')
                                             , hideLabel: true
                                             , name: 'gridclasskey-property-child-isfolder'
                                             , inputValue: 1
                                             , checked: parseInt(config.record['gridclasskey-property-child-isfolder']) || 0
                                             
                                             },*/ {
                                                xtype: 'checkbox'
                                                , boxLabel: _('resource_searchable')
                                                , description: '<b>[[*searchable]]</b><br />' + _('resource_searchable_help')
                                                , hideLabel: true
                                                , name: 'gridclasskey-property-child-searchable'
                                                , inputValue: 1
                                                , checked: parseInt(config.record['gridclasskey-property-child-searchable'])
                                            }, {
                                                xtype: 'checkbox'
                                                , boxLabel: _('resource_richtext')
                                                , description: '<b>[[*richtext]]</b><br />' + _('resource_richtext_help')
                                                , hideLabel: true
                                                , name: 'gridclasskey-property-child-richtext'
                                                , inputValue: 1
                                                , checked: parseInt(config.record['gridclasskey-property-child-richtext'])
                                            }
                                        ]
                                    }, {
                                        columnWidth: .5
                                        , defaults: {
                                            listeners: {
                                                change: {
                                                    fn: function(cmp, newValue, oldValue) {
                                                        var btn = Ext.getCmp('modx-abtn-save');
                                                        if (btn) {
                                                            btn.enable();
                                                        }
                                                    }
                                                    , scope: this
                                                }
                                            }
                                        }
                                        , items: [
                                            {
                                                xtype: 'checkbox'
                                                , boxLabel: _('resource_published')
                                                , hideLabel: true
                                                , description: '<b>[[*published]]</b><br />' + _('resource_published_help')
                                                , name: 'gridclasskey-property-child-published'
                                                , inputValue: 1
                                                , checked: parseInt(config.record['gridclasskey-property-child-published'])
                                            }, {
                                                xtype: 'checkbox'
                                                , boxLabel: _('resource_cacheable')
                                                , description: '<b>[[*cacheable]]</b><br />' + _('resource_cacheable_help')
                                                , hideLabel: true
                                                , name: 'gridclasskey-property-child-cacheable'
                                                , inputValue: 1
                                                , checked: parseInt(config.record['gridclasskey-property-child-cacheable'])

                                            }, /*{
                                             xtype: 'checkbox'
                                             , boxLabel: _('resource_syncsite')
                                             , description: _('resource_syncsite_help')
                                             , hideLabel: true
                                             , name: 'gridclasskey-property-child-syncsite'
                                             , inputValue: 1
                                             , checked: config.record['gridclasskey-property-child-syncsite'] !== undefined
                                             && config.record['gridclasskey-property-child-syncsite'] !== null
                                             ? parseInt(config.record['gridclasskey-property-child-syncsite'])
                                             : true
                                             
                                             },*/ {
                                                xtype: 'checkbox'
                                                , boxLabel: _('deleted')
                                                , description: '<b>[[*deleted]]</b>'
                                                , hideLabel: true
                                                , name: 'gridclasskey-property-child-deleted'
                                                , inputValue: 1
                                                , checked: parseInt(config.record['gridclasskey-property-child-deleted']) || false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    }
});
Ext.reg('gridclasskey-panel-settings', GridClassKey.panel.Settings);