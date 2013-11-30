GridClassKey.combo.MainFields = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        id: 'gridclasskey-combo-mainfields'
        , url: GridClassKey.connector_url
        , baseParams: {
            action: 'fields/getMainFieldsList'
        }
        , fields: ['name']
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