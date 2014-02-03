GridClassKey.window.AdvancedSearch = function(config) {
    config = config || {};
    var check = Ext.getCmp('gridclasskey-window-advancedsearch');
    if (check) {
        check.destroy();
    }
    Ext.apply(config, {
        id: 'gridclasskey-window-advancedsearch'
        , url: GridClassKey.config.connectorUrl
        , title: _('gridclasskey.advanced_search')
        , baseParams: {
            action: 'mgr/classkey/children/getlist'
            , parent: config.parent
        }
        , labelAlign: 'left'
        , labelWidth: 120
        , blankValues: false
        , fields: [
            {
                xtype: 'textfield'
                , id: 'gridclasskey-search-field-filter'
                , name: 'gridclasskey-search-field-filter'
                , fieldLabel: _('gridclasskey.search')
                , anchor: '100%'
                , value: config.query || ''
                , listeners: {
                    'render': {
                        fn: function(cmp) {
                            var _this = this;
                            new Ext.KeyMap(cmp.getEl(), {
                                key: Ext.EventObject.ENTER
                                , fn: function() {
                                    _this.advancedSearch();
                                    this.blur();
                                    return true;
                                }
                                , scope: cmp
                            });
                        }
                        , scope: this
                    }
                }
            }, {
                xtype: 'gridclasskey-combo-template'
                , id: 'gridclasskey-template-filter'
                , name: 'gridclasskey-template-filter'
                , hiddenName: 'gridclasskey-template-filter'
                , fieldLabel: _('template')
                , anchor: '100%'
                , allowBlank: true
            }, {
                xtype: 'gridclasskey-panel-mainfieldscombo'
                , id: 'gridclasskey-panel-mainfieldscombo-filter'
                , fieldLabel: _('gridclasskey.settings_add_main_field')
                , name: ''
                , hiddenName: ''
                , applyToGrid: 'gridclasskey-grid-advancedsearch'
                , border: false
            }, {
                xtype: 'gridclasskey-panel-tvfieldscombo'
                , id: 'gridclasskey-panel-tvfieldscombo-filter'
                , fieldLabel: _('gridclasskey.settings_add_tv_field')
                , name: ''
                , hiddenName: ''
                , applyToGrid: 'gridclasskey-grid-advancedsearch'
                , border: false
            }, {
                columnWidth: 1
                , xtype: 'gridclasskey-grid-advancedsearch'
            }
        ]
        , buttons: [
            {
                text: _('cancel')
                , scope: this
                , handler: function() {
                    config.closeAction !== 'close' ? this.hide() : this.close();
                }
            }, {
                text: _('gridclasskey.search')
                , handler: function() {
                    return this.advancedSearch();
                }
                , scope: this
            }
        ],
        listeners: {
            'close': {
                fn: function(p) {
                    var searchField = Ext.getCmp('gridclasskey-search-field');
                    searchField.setDisabled(false);
                }
            }
            , 'hide': {
                fn: function(p) {
                    var searchField = Ext.getCmp('gridclasskey-search-field');
                    searchField.setDisabled(false);
                }
            }
        }
    });
    GridClassKey.window.AdvancedSearch.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.window.AdvancedSearch, MODx.Window, {
    advancedSearch: function() {
        var values = this.fp.getForm().getValues();
        delete(values['gridclasskey-panel-mainfieldscombo-filter-combo']);
        delete(values['gridclasskey-panel-tvfieldscombo-filter-combo']);

        var store = Ext.getCmp('gridclasskey-grid-advancedsearch').getStore();
        var l = store.data.items.length;

        if (values['gridclasskey-search-field-filter'] === ''
                && values['gridclasskey-template-filter'] === ''
                && l === 0
                ) {
            return false;
        }
        var childrenGrid = Ext.getCmp('gridclasskey-grid-children');
        var s = childrenGrid.getStore();
        if (values['gridclasskey-search-field-filter']) {
            s.baseParams.query = values['gridclasskey-search-field-filter'];
        }
        if (values['gridclasskey-template-filter']) {
            s.baseParams.template = values['gridclasskey-template-filter'];
        }

        var fields = [];
        if (l > 0) {
            for (var i = 0; i < l; i++) {
                if (store.data.items[i].data.value) {
                    fields.push({
                        name: store.data.items[i].data.name,
                        value: store.data.items[i].data.value
                    });
                }
            }
            s.baseParams.fields = JSON.stringify(fields);
        }

        childrenGrid.getBottomToolbar().changePage(1);
        childrenGrid.refresh();
    }
});
Ext.reg('gridclasskey-window-advancedsearch', GridClassKey.window.AdvancedSearch);