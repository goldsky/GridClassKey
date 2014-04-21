GridClassKey.grid.ChildrenResourceSecurity = function(config) {
    config = config || {};

    var qs = Ext.urlDecode(window.location.search.substring(1));
    Ext.applyIf(config, {
        id: 'gridclasskey-grid-childrenresource-security'
        , url: GridClassKey.config.connectorUrl
        , baseParams: {
            action: 'mgr/classkey/children/resourcegroups'
            , resource: config.resource
            , "token": qs.reload || ''
            , record: config.record
        }
    });
    GridClassKey.grid.ChildrenResourceSecurity.superclass.constructor.call(this, config);
    this.on('rowclick', MODx.fireResourceFormChange);
};
Ext.extend(GridClassKey.grid.ChildrenResourceSecurity, MODx.grid.ResourceSecurity);
Ext.reg('gridclasskey-grid-childrenresource-security', GridClassKey.grid.ChildrenResourceSecurity);