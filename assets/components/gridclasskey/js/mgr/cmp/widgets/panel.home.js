GridClassKey.panel.Home = function(config) {
    config = config || {};
    Ext.applyIf(config, {
        id: 'gridclasskey-panel-home'
        ,border: false
        ,baseCls: 'modx-formpanel'
        ,cls: 'container'
        ,items: [{
            html: '<h2>'+_('gridclasskey')+'</h2>'
            ,border: false
            ,cls: 'modx-page-header'
        },{
            layout: 'form'
            ,items: [{
                html: '<p>'+_('gridclasskey.management_desc')+'</p>'
                ,bodyCssClass: 'panel-desc'
                ,border: false
            },{
                xtype: 'gridclasskey-grid-containers'
                ,cls:'main-wrapper'
                ,preventRender: true
            }]
        }]
    });
    GridClassKey.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.panel.Home, MODx.Panel);
Ext.reg('gridclasskey-panel-home', GridClassKey.panel.Home);