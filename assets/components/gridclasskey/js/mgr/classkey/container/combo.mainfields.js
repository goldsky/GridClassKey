GridClassKey.combo.MainFields = function(config) {
    config = config || {};

    Ext.apply(config, {
        url: GridClassKey.config.connectorUrl
        , baseParams: {
            action: 'mgr/classkey/fields/getMainFieldsList'
        }
        , fields: ['name']
        , width: config.comboWidth || 190
        /**
         * Don't give name, exclude this combo out of the saving
         */
//        , name: 'mainfield'
//        , hiddenName: 'mainfield'
        , displayField: 'name'
        , valueField: 'name'
    });
    GridClassKey.combo.MainFields.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.combo.MainFields, MODx.combo.ComboBox);
Ext.reg('gridclasskey-combo-mainfields', GridClassKey.combo.MainFields);