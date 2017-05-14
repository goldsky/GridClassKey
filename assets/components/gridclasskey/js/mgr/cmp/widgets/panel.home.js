GridClassKey.panel.Home = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        id: 'gridclasskey-panel-home'
        , border: false
        , baseCls: 'modx-formpanel'
        , cls: 'container'
        , items: [
            {
                html: '<h2>' + _('gridclasskey') + '</h2>'
                , border: false
                , cls: 'modx-page-header'
            }, {
                xtype: 'modx-tabs'
                , defaults: {border: false, autoHeight: true}
                , border: true
                , items: [
                    {
                        title: _('gridclasskey.containers')
                        , defaults: {autoHeight: true}
                        , items: [
                            {
                                html: '<p>' + _('gridclasskey.management_desc') + '</p>'
                                , bodyCssClass: 'panel-desc'
                                , border: false
                            }, {
                                xtype: 'gridclasskey-grid-containers'
                                , cls: 'main-wrapper'
                                , preventRender: true
                            }
                        ]
                    }, {
                        title: _('gridclasskey.children')
                        , defaults: {autoHeight: true}
                        , items: [
                            {
                                html: '<p>' + _('gridclasskey.management_desc') + '</p>'
                                , bodyCssClass: 'panel-desc'
                                , border: false
                            }, {
                                xtype: 'gridclasskey-grid-childrencmp'
                                , cls: 'main-wrapper'
                                , preventRender: true
                            }
                        ]
                    }
                ]
                // only to redo the grid layout after the content is rendered
                // to fix overflow components' panels, especially when scroll bar is shown up
                , listeners: {
                    'afterrender': function (tabPanel) {
                        tabPanel.doLayout();
                    }
                }
            }
        ]
    });
    GridClassKey.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.panel.Home, MODx.Panel);
Ext.reg('gridclasskey-panel-home', GridClassKey.panel.Home);