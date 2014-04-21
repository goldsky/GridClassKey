GridClassKey.window.Setting = function(config) {
    config = config || {};

    Ext.apply(config, {
        url: GridClassKey.config.connectorUrl,
        width: 870,
        fields: [
            {
                xtype: 'gridclasskey-panel-settings'
                , border: true
                , record: config.record
            }
        ],
        listeners: {
            beforeSubmit: {
                fn: this.beforeSubmit
                , scope: this
            }
        }
    });
    GridClassKey.window.Setting.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.window.Setting, MODx.Window, {
    getGridSettingValues: function(){
        var grid = Ext.getCmp('gridclasskey-grid-gridsettings');
        var store = grid.getStore();
        var fields = [];
        for (var i = 0, l = store.data.items.length; i < l; i++) {
            fields.push({
                name: store.data.items[i].data.name,
                type: store.data.items[i].data.type,
                lexicon: store.data.items[i].data.lexicon,
                width: store.data.items[i].data.width,
                fixed: store.data.items[i].data.fixed,
                sortable: store.data.items[i].data.sortable,
                hidden: store.data.items[i].data.hidden,
                editor_type: store.data.items[i].data.editor_type,
                output_filter: store.data.items[i].data.output_filter
            });
        }

        return fields;
    },
    beforeSubmit: function(o) {
        var fields = this.getGridSettingValues();
        Ext.getCmp('gridclasskey-property-fields').setValue(JSON.stringify(fields));
    }
});
Ext.reg('gridclasskey-window-setting', GridClassKey.window.Setting);