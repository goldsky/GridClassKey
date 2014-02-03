GridClassKey.panel.Home = function(config) {
    config = config || {};
    Ext.apply(config, {
        id: 'gridclasskey-panel-home'
        , border: false
        , defaults: {
            border: false
        }
        , items: [
            {
                html: '<h2>' + _('gridclasskey') + '</h2>'
            }, {
                html: '<p>' + _('gridclasskey.management_desc') + '</p>'
                , bodyCssClass: 'panel-desc'
            }, {
                xtype: 'gridclasskey-grid-containers'
            }
        ]
    });
    GridClassKey.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.panel.Home, MODx.Panel);
Ext.reg('gridclasskey-panel-home', GridClassKey.panel.Home);