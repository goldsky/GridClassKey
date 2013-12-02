GridClassKey.panel.TVFieldsCombo = function(config) {
    config = config || {};

    Ext.applyIf(config, {
        id: 'gridclasskey-panel-tvfieldscombo'
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
                html: '<div class="x-form-item-label">' + _('gridclasskey.settings_add_tv_field') + ': </div>'
                , border: false
            }, {
                xtype: 'gridclasskey-combo-tvfields'
            }, {
                xtype: 'button'
                , text: _('add')
                , handler: function() {
                    var gridSettingsGrid = Ext.getCmp('gridclasskey-grid-gridsettings');
                    var fieldsCombo = Ext.getCmp('gridclasskey-combo-tvfields');
                    var comboValue = fieldsCombo.getValue();
                    var text = fieldsCombo.lastSelectionText;
                    if (comboValue) {
                        gridSettingsGrid.data.push([text]);
                        gridSettingsGrid.getStore().loadData(gridSettingsGrid.data);
                        gridSettingsGrid.getView().refresh();

                        var btn = Ext.getCmp('modx-abtn-save');
                        if (btn) {
                            btn.enable();
                        }
                    }
                }
            }, {
                xtype: 'button'
                , text: _('gridclasskey.clear')
                , handler: function() {
                    var fieldsCombo = Ext.getCmp('gridclasskey-combo-tvfields');
                    fieldsCombo.setValue('');

                    var btn = Ext.getCmp('modx-abtn-save');
                    if (btn) {
                        btn.enable();
                    }
                }
            }
        ]
    });

    GridClassKey.panel.TVFieldsCombo.superclass.constructor.call(this, config);
};


Ext.extend(GridClassKey.panel.TVFieldsCombo, MODx.Panel);
Ext.reg('gridclasskey-panel-tvfieldscombo', GridClassKey.panel.TVFieldsCombo);