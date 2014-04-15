GridClassKey.panel.SnippetFieldsCombo = function(config) {
    config = config || {};

    var items = [];
    if (!config.fieldLabel) {
        items.push({
            html: '<div class="x-form-item-label">' + _('gridclasskey.settings_add_snippet_field') + ': </div>'
            , border: false
        });
    }
    items.push({
        xtype: 'gridclasskey-combo-snippetfields'
        , id: config.id + '-combo' || ''
        , comboWidth: config.comboWidth || ''
    }, {
        xtype: 'button'
        , text: _('add')
        , handler: function() {
            if (config.applyToGrid) {
                var targetGrid = Ext.getCmp(config.applyToGrid),
                        store = targetGrid.getStore();
                var fieldsCombo = Ext.getCmp(config.id + '-combo');
                var comboValue = fieldsCombo.getValue();
                var text = fieldsCombo.lastSelectionText;
                if (comboValue) {
                    var r = new store.recordType({"sort": store.getCount() + 1, "name": text, "type": "snippet"}); 
                    r.commit();
                    store.add(r);
                    store.commitChanges();
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

    GridClassKey.panel.SnippetFieldsCombo.superclass.constructor.call(this, config);
};


Ext.extend(GridClassKey.panel.SnippetFieldsCombo, MODx.Panel);
Ext.reg('gridclasskey-panel-snippetfieldscombo', GridClassKey.panel.SnippetFieldsCombo);