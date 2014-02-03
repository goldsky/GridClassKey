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
        ]
    });
    GridClassKey.window.Setting.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.window.Setting, MODx.Window);
Ext.reg('gridclasskey-window-setting', GridClassKey.window.Setting);