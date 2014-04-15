GridClassKey.combo.SnippetFields = function(config) {
    config = config || {};

    Ext.apply(config, {
        url: GridClassKey.config.connectorUrl
        , baseParams: {
            action: 'mgr/classkey/fields/getSnippetFieldsList'
        }
        , pageSize: 10
        , typeAhead: true
        , editable: true
        , minChars: 1
        , triggerAction: 'all'
        , forceSelection:true
        , lazyRender: true
        , fields: ['id', 'name']
        , width: 190
        /**
         * Don't give name, exclude this combo out of the saving
         */
//        , name: 'snippetfield'
//        , hiddenName: 'snippetfield'
        , displayField: 'name'
        , valueField: 'id'
    });
    GridClassKey.combo.SnippetFields.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.combo.SnippetFields, MODx.combo.ComboBox);
Ext.reg('gridclasskey-combo-snippetfields', GridClassKey.combo.SnippetFields);