GridClassKey.panel.Container = function(config) {
    config = config || {};

    GridClassKey.panel.Container.superclass.constructor.call(this, config);
};

Ext.extend(GridClassKey.panel.Container, MODx.panel.Resource, {
    getFields: function(config) {
        var it = [];
        // update
        if (config.record.id) {
            it.push({
                id: 'gridclasskey-grid-children-panel'
                , title: config.record['gridclasskey-property-grid-childrentab-text'] || _('gridclasskey.children')
                , cls: 'modx-resource-tab'
                , layout: 'fit'
                , forceLayout: true
                , deferredRender: false
                , labelWidth: 200
                , bodyCssClass: 'main-wrapper'
                , autoHeight: true
                , defaults: {
                    border: false
                    , msgTarget: 'under'
                }
                , items: this.getChildren(config)
            });
        }
        it.push({
            title: _('document')
            , id: 'modx-resource-settings'
            , cls: 'modx-resource-tab'
            , layout: 'form'
            , labelAlign: 'top'
            , labelSeparator: ''
            , bodyCssClass: 'tab-panel-wrapper main-wrapper'
            , autoHeight: true
            , defaults: {
                border: false
                , msgTarget: 'under'
                , width: 400
            }
            , items: this.getMainFields(config)
        });
        var ct = this.getContentField(config);
        if (ct) {
            it.push({
                title: _('resource_content')
                , id: 'modx-resource-content'
                , layout: 'form'
                , bodyCssClass: 'main-wrapper'
                , autoHeight: true
                , collapsible: true
                , animCollapse: false
                , hideMode: 'offsets'
                , items: ct
                , style: 'margin-top: 10px'
            });
        }
        it.push({
            id: 'modx-page-settings'
            , title: _('settings')
            , cls: 'modx-resource-tab'
            , layout: 'form'
            , forceLayout: true
            , deferredRender: false
            , labelWidth: 200
            , bodyCssClass: 'main-wrapper'
            , autoHeight: true
            , defaults: {
                border: false
                , msgTarget: 'under'
            }
            , items: this.getSettingFields(config)
        });
        if (config.show_tvs && MODx.config.tvs_below_content != 1) {
            it.push(this.getTemplateVariablesPanel(config));
        }
        if (MODx.perm.resourcegroup_resource_list == 1) {
            it.push(this.getAccessPermissionsTab(config));
        }
        var its = [];
        its.push(this.getPageHeader(config), {
            id: 'modx-resource-tabs'
            , xtype: 'modx-tabs'
            , forceLayout: true
            , deferredRender: false
            , collapsible: true
            , animCollapse: false
            , itemId: 'tabs'
            , items: it
        });
        if (config.show_tvs && MODx.config.tvs_below_content == 1) {
            its.push(this.getTemplateVariablesPanel(config));
        }
        return its;
    },
    getPageHeader: function(config) {
        config = config || {record: {}};
        return {
            html: '<h2>' + _('gridclasskey.container_new') + '</h2>'
            , id: 'modx-resource-header'
            , cls: 'modx-page-header'
            , border: false
            , forceLayout: true
            , anchor: '100%'
        };
    },
    getChildren: function(config) {
        var items = [];
        items.push({
            xtype: 'gridclasskey-grid-children'
            , record: config.record
        });
        return items;
    },
    getSettingFields: function(config) {
        config = config || {record: {}};

        var s = [{
                layout: 'column'
                , border: false
                , anchor: '100%'
                , defaults: {
                    labelSeparator: ''
                    , labelAlign: 'top'
                    , border: false
                    , layout: 'form'
                    , msgTarget: 'under'
                }
                , items: [
                    {
                        columnWidth: .5
                        , id: 'modx-page-settings-left'
                        , defaults: {msgTarget: 'under'}
                        , items: this.getSettingLeftFields(config)
                    }, {
                        columnWidth: .5
                        , id: 'modx-page-settings-right'
                        , defaults: {msgTarget: 'under'}
                        , items: this.getSettingRightFields(config)
                    }, {
                        columnWidth: 1
                        , items: [
                            {
                                xtype: 'gridclasskey-panel-settings'
                                , record: config.record
                            }
                        ]
                    }
                ]
            }];
        return s;
    },
    getGridSettingValues: function(){
        var grid = Ext.getCmp('gridclasskey-grid-gridsettings');
        var store = grid.getStore();
        var fields = [];
        for (var i = 0, l = store.data.items.length; i < l; i++) {
            fields.push({
                name: store.data.items[i].data.name,
                type: store.data.items[i].data.type,
                lexicon: store.data.items[i].data.lexicon,
                width: store.data.items[i].data.width,
                fixed: store.data.items[i].data.fixed,
                sortable: store.data.items[i].data.sortable,
                hidden: store.data.items[i].data.hidden,
                editor_type: store.data.items[i].data.editor_type,
                output_filter: store.data.items[i].data.output_filter
            });
        }

        return fields;
    },
    beforeSubmit: function(o) {
        var fields = this.getGridSettingValues();
        Ext.getCmp('gridclasskey-property-fields').setValue(JSON.stringify(fields));

        return GridClassKey.panel.Container.superclass.beforeSubmit.apply(this, arguments);
    },
    success: function(o) {
        // upgrade differences
        this.config.record.properties = this.config.record.properties || {};
        this.config.record.properties.gridclasskey = this.config.record.properties.gridclasskey || {};

        var fields = this.getGridSettingValues();
        this.config.record.properties.gridclasskey['fields'] = fields;

        var childrenTab = Ext.getCmp('gridclasskey-grid-children-panel');
        if (typeof (childrenTab) !== 'undefined') {
            var childrenTabText = Ext.getCmp('gridclasskey-property-grid-childrentab-text').getValue();
            if (childrenTabText) {
                childrenTab.setTitle(childrenTabText);
                this.config.record.properties.gridclasskey['grid-childrentab-text'] = childrenTabText;
            } else {
                childrenTab.setTitle(_('gridclasskey.children'));
                this.config.record.properties.gridclasskey['grid-childrentab-text'] = _('gridclasskey.children');
            }
        }

        var addNewDocBtn = Ext.getCmp('gridclasskey-property-grid-addnewdocbtn');
        if (typeof (addNewDocBtn) !== 'undefined') {
            var addNewDocText = Ext.getCmp('gridclasskey-property-grid-addnewdocbtn-text').getValue();
            if (addNewDocText) {
                addNewDocBtn.setText(childrenTabText);
                this.config.record.properties.gridclasskey['grid-addnewdocbtn-text'] = addNewDocText;
            } else {
                addNewDocBtn.setText(_('gridclasskey.document_new'));
                this.config.record.properties.gridclasskey['grid-addnewdocbtn-text'] = _('gridclasskey.document_new');
            }
        }

        var container = Ext.getCmp('gridclasskey-grid-children-panel');
        if (typeof (container) !== 'undefined') {
            container.removeAll();
            container.add({
                xtype: 'gridclasskey-grid-children',
                record: this.config.record
            });
            container.doLayout();
        }

        return GridClassKey.panel.Container.superclass.success.call(this, o);
    }
});
Ext.reg('gridclasskey-panel-container', GridClassKey.panel.Container);