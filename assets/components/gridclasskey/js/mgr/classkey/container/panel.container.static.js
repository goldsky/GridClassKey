GridClassKey.panel.StaticContainer = function(config) {
    config = config || {};
    config.record = config.record || {};

    Ext.applyIf(config, {
        id: 'modx-panel-resource'
        , class_key: 'StaticGridContainer'
        , items: this.getFields(config)
    });

    GridClassKey.panel.StaticContainer.superclass.constructor.call(this, config);
};

Ext.extend(GridClassKey.panel.StaticContainer, GridClassKey.panel.Container, {
    defaultClassKey: 'StaticGridContainer',
    classLexiconKey: 'gridclasskey.static_container',
    rteElements: false,
    getPageHeader: function(config) {
        config = config || {record: {}};
        return {
            html: '<h2>' + _('gridclasskey.static_container_new') + '</h2>'
            , id: 'modx-resource-header'
            , cls: 'modx-page-header'
            , border: false
            , forceLayout: true
            , anchor: '100%'
        };
    },
    getMainFields: function(config) {
        var its = GridClassKey.panel.StaticContainer.superclass.getMainFields.call(this, config);
        its.push({
            xtype: 'modx-combo-browser'
            , browserEl: 'modx-browser'
            , prependPath: false
            , prependUrl: false
            , hideFiles: true
            , fieldLabel: _('static_resource')
            , description: '<b>[[*content]]</b>'
            , name: 'content'
            , id: 'modx-resource-content'
            , maxLength: 255
            , anchor: '100%'
            , value: (config.record.content || config.record.ta) || ''
            , openTo: config.record.openTo
            , listeners: {
                'select': {fn: function(data) {
                        var str = data.fullRelativeUrl;
                        if (MODx.config.base_url != '/') {
                            str = str.replace(MODx.config.base_url, '');
                        }
                        if (str.substring(0, 1) == '/') {
                            str = str.substring(1);
                        }
                        Ext.getCmp('modx-resource-content').setValue(str);
                        this.markDirty();
                    }, scope: this}
            }
        });
        return its;
    },
    getContentField: function(config) {
        return null;
    }
});
Ext.reg('gridclasskey-panel-staticcontainer', GridClassKey.panel.StaticContainer);