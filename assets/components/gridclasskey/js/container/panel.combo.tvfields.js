GridClassKey.panel.TVFieldsCombo = function(config) {
    config = config || {};

    var items = [];
    if (!config.fieldLabel) {
        items.push({
            html: '<div class="x-form-item-label">' + _('gridclasskey.settings_add_tv_field') + ': </div>'
            , border: false
        });
    }
    items.push({
        xtype: 'gridclasskey-combo-tvfields'
        , id: config.id + '-combo' || ''
    }, {
        xtype: 'button'
        , text: _('add')
        , handler: function() {
            if (config.applyToGrid) {
                var targetGrid = Ext.getCmp(config.applyToGrid);
                var fieldsCombo = Ext.getCmp(config.id + '-combo');
                var comboValue = fieldsCombo.getValue();
                var text = fieldsCombo.lastSelectionText;
                if (comboValue) {
                    targetGrid.data.push([text]);
                    targetGrid.getStore().loadData(targetGrid.data);
                    targetGrid.getView().refresh();
                    Ext.getCmp('modx-panel-resource').markDirty();
                    var btn = Ext.getCmp('modx-abtn-save');
                    if (btn) {
                        btn.enable();
                    }
                }
            }
        }
        , scope: this
    }, {
        xtype: 'button'
        , text: _('gridclasskey.clear')
        , handler: function() {
            var fieldsCombo = Ext.getCmp(config.id + '-combo');
            fieldsCombo.setValue('');

            var btn = Ext.getCmp('modx-abtn-save');
            if (btn) {
                btn.enable();
            }
        }
        , scope: this
    });

    Ext.apply(config, {
        layout: 'hbox'
        , layoutConfig: {
            align: 'middle'
            , pack: 'start'
        }
        , defaults: {
            margins: '0 5 0 0'
        }
        , items: items
    });

    GridClassKey.panel.TVFieldsCombo.superclass.constructor.call(this, config);
};


Ext.extend(GridClassKey.panel.TVFieldsCombo, MODx.Panel);
Ext.reg('gridclasskey-panel-tvfieldscombo', GridClassKey.panel.TVFieldsCombo);