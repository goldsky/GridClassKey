var GridClassKey = function(config) {
    config = config || {};
    GridClassKey.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey, Ext.Component, {
    page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}, view: {}, extra: {}
    , connector_url: ''
});
Ext.reg('gridclasskey', GridClassKey);

GridClassKey = new GridClassKey();