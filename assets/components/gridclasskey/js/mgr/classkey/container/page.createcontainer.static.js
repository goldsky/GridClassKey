GridClassKey.page.CreateContainer = function(config) {
    config = config || {record: {}};
    config.record = config.record || {};
    Ext.apply(config, {
        panelXType: 'gridclasskey-panel-staticcontainer'
    });
    config.canDuplicate = true;
    config.canDelete = true;
    GridClassKey.page.CreateContainer.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.page.CreateContainer, MODx.page.CreateResource);
Ext.reg('gridclasskey-page-container-create', GridClassKey.page.CreateContainer);