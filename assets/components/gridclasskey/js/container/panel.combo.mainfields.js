GridClassKey.panel.MainFieldsCombo = function(config) {
    config = config || {};

    Ext.applyIf(config, {
        id: 'gridclasskey-panel-mainfieldscombo'
        , layout: 'hbox'
        , layoutConfig: {
            align: 'middle'
            , pack: 'start'
        }
        , defaults: {
            margins: '0 5 0 0'
        }
        , items: [
            {
                html: '<div class="x-form-item-label">' + _('gridclasskey.settings_add_main_field') + ': </div>'
                , border: false
            }, {
                xtype: 'gridclasskey-combo-mainfields'
            }, {
                xtype: 'button'
                , text: _('add')
                , handler: function() {
                    var gridSettingsGrid = Ext.getCmp('gridclasskey-grid-gridsettings');
                    var fieldsCombo = Ext.getCmp('gridclasskey-combo-mainfields');
                    var comboValue = fieldsCombo.getValue();
                    if (comboValue) {
                        gridSettingsGrid.data.push([comboValue]);
                        gridSettingsGrid.getStore().loadData(gridSettingsGrid.data);
                        gridSettingsGrid.getView().refresh();
                    }
                },
                scope: this
            }, {
                xtype: 'button'
                , text: _('gridclasskey.clear')
                , handler: function() {
                    var fieldsCombo = Ext.getCmp('gridclasskey-combo-mainfields');
                    fieldsCombo.setValue('');
                }
            }
        ]
    });

    GridClassKey.panel.MainFieldsCombo.superclass.constructor.call(this, config);
};


Ext.extend(GridClassKey.panel.MainFieldsCombo, MODx.Panel);
Ext.reg('gridclasskey-panel-mainfieldscombo', GridClassKey.panel.MainFieldsCombo);