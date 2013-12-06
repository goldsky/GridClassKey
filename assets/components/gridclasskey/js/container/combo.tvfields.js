GridClassKey.combo.TVFields = function(config) {
    config = config || {};

    Ext.apply(config, {
        url: GridClassKey.connector_url
        , baseParams: {
            action: 'fields/getTVFieldsList'
        }
        , pageSize: 10
        , lazyRender: true
        , fields: ['id', 'name']
        , width: 190
        /**
         * Don't give name, exclude this combo out of the saving
         */
//        , name: 'tvfield'
//        , hiddenName: 'tvfield'
        , displayField: 'name'
        , valueField: 'id'
    });
    GridClassKey.combo.TVFields.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.combo.TVFields, MODx.combo.ComboBox);
Ext.reg('gridclasskey-combo-tvfields', GridClassKey.combo.TVFields);