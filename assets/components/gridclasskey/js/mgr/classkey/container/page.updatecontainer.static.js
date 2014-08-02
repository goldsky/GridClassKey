GridClassKey.page.UpdateContainer = function(config) {
    config = config || {record: {}};
    config.record = config.record || {};
    Ext.apply(config, {
        panelXType: 'gridclasskey-panel-staticcontainer'
        , actions: {
            'new': MODx.action ? MODx.action['resource/create'] : 'resource/create'
            , edit: MODx.action ? MODx.action['resource/update'] : 'resource/update'
            , preview: MODx.action ? MODx.action['resource/preview'] : 'resource/preview'
        }
    });
    config.canDuplicate = true;
    config.canDelete = true;
    GridClassKey.page.UpdateContainer.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.page.UpdateContainer, MODx.page.UpdateResource);
Ext.reg('gridclasskey-page-container-update', GridClassKey.page.UpdateContainer);