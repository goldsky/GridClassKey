Ext.onReady(function() {
    MODx.load({xtype: 'gridclasskey-page-home'});
});

GridClassKey.page.Home = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        components: [{
                xtype: 'gridclasskey-panel-home'
                , renderTo: 'gridclasskey-panel-home-div'
            }]
    });
    GridClassKey.page.Home.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.page.Home, MODx.Component);
Ext.reg('gridclasskey-page-home', GridClassKey.page.Home);