GridClassKey.combo.TVFields = function(config) {
    config = config || {};

    Ext.applyIf(config, {
        id: 'gridclasskey-combo-tvfields'
        , url: GridClassKey.connector_url
        , baseParams: {
            action: 'fields/getTVFieldsList'
        }
        , pageSize: 10
        , lazyRender: true
        , fields: ['id', 'name']
        /**
         * Don't give name, exclude this combo out of the saving
         */
//        , name: 'tvfield'
//        , hiddenName: 'tvfield'
        , displayField: 'name'
        , valueField: 'id'
        , width: 190
    });
    GridClassKey.combo.TVFields.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.combo.TVFields, MODx.combo.ComboBox);
Ext.reg('gridclasskey-combo-tvfields', GridClassKey.combo.TVFields);