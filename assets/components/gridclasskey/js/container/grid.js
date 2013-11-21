GridClassKey.grid.Children = function(config) {
    config = config || {};

    Ext.applyIf(config, {
        id: 'gridclasskey-grid-children'
        , url: GridClassKey.connector_url
        , baseParams: {
            action: 'children/getList',
            parent: config.record.id
        }
        , fields: ['id', 'pagetitle', 'longtitle', 'description', 'deleted', 'published'
                    , 'publishedon_date', 'action_edit', 'preview_url', 'actions', 'action_edit']
        , paging: true
        , remoteSort: true
        , autoExpandColumn: 'description'
        , viewConfig: {
            forceFit: true
            , enableRowBody: true
            , scrollOffset: 0
            , autoFill: true
            , showPreview: true
            , getRowClass: function(record, index, rowParams, store) {
                var clsName = 'gridclasskey-row';
                if (record.get('published') === false) {
                    clsName += ' gridclasskey-unpublished';
                }
                if (record.get('deleted') === true) {
                    clsName += ' gridclasskey-deleted';
                }
                return clsName;
            }
        }
        , save_action: 'children/updateFromGrid'
        , autosave: true
        , columns: [
            {
                header: _('id')
                , dataIndex: 'id'
                , sortable: true
                , width: 50
            }, {
                header: _('pagetitle')
                , dataIndex: 'pagetitle'
                , sortable: true
                , width: 100
                , renderer: {fn: this._renderPageTitle, scope: this}
                , editor: {
                    xtype: 'textfield'
                }
            }, {
                header: _('gridclasskey.longtitle')
                , dataIndex: 'longtitle'
                , sortable: true
                , width: 100
                , editor: {
                    xtype: 'textfield'
                }
            }, {
                header: _('description')
                , dataIndex: 'description'
                , sortable: false
                , editor: {
                    xtype: 'textarea'
                }
            }
        ]
        , tbar: [
            {
                text: _('gridclasskey.document_new')
                , iconCls: 'icon-gridclasskey-document-new'
                , handler: function(itm, e) {
                    Ext.getCmp('modx-resource-tree').loadAction(
                            'a=' + MODx.action['resource/create']
                            + '&parent=' + config.record.id
                            + (config.record.context_key ? '&context_key=' + config.record.context_key : '')
                            );
                }
            }, '->', {
                xtype: 'textfield'
                , id: 'gridclasskey-search-filter'
                , emptyText: _('gridclasskey.search...')
                , listeners: {
                    'change': {fn: this.search, scope: this}
                    , 'render': {fn: function(cmp) {
                            new Ext.KeyMap(cmp.getEl(), {
                                key: Ext.EventObject.ENTER
                                , fn: function() {
                                    this.fireEvent('change', this);
                                    this.blur();
                                    return true;
                                }
                                , scope: cmp
                            });
                        }, scope: this}
                }
            }
        ]
    });
    GridClassKey.grid.Children.superclass.constructor.call(this, config)
    this._makeTemplates();

};
Ext.extend(GridClassKey.grid.Children, MODx.grid.Grid, {
    search: function(tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    },
    getMenu: function() {
        var deleteTitle = this.menu.record.deleted ? _('resource_undelete') : _('resource_delete');
        var publishTitle = this.menu.record.published ? _('unpublish') : _('publish');
        var menu = [
            {
                text: _('edit')
                , handler: function(btn, e) {
                    this.updateChild(this.menu.record);
                }
            }, {
                text: _('view')
                , handler: function(btn, e) {
                    window.open(this.menu.record.preview_url);
                }
            }, {
                text: publishTitle
                , handler: function(btn, e) {
                    if (this.menu.record.published === true) {
                        this.unpublishChild(this.menu.record);
                    } else {
                        this.publishChild(this.menu.record);
                    }
                }
            }, '-', {
                text: deleteTitle
                , handler: function(btn, e) {
                    this.removeChild(this.menu.record);
                }
            }
        ];
        return menu;
    },
    updateChild: function(record) {
        MODx.loadPage(MODx.action['resource/update'], 'id=' + record.id);
    },
    removeChild: function(record) {
        var title = record.deleted ? _('resource_undelete') : _('resource_delete');
        var text = record.deleted ? _('resource_undelete_confirm') : _('resource_delete_confirm');
        var action = record.deleted ? 'undelete' : 'delete';
        MODx.msg.confirm({
            title: title
            , text: text
            , url: MODx.config.connectors_url + 'resource/index.php'
            , params: {
                action: action
                , id: record.id
            }
            , listeners: {
                'success': {
                    fn: this.refresh,
                    scope: this
                }
            }
        });
    },
    _makeTemplates: function() {
        this.tplPageTitle = new Ext.XTemplate('<tpl for="."><a href="{action_edit}" title="' + _('edit') + ' {pagetitle}">{pagetitle}</a></tpl>', {
            compiled: true
        });
    },
    _renderPageTitle: function(v, md, rec) {
        return this.tplPageTitle.apply(rec.data);
    },
    publishChild: function(btn, e) {
        MODx.Ajax.request({
            url: MODx.config.connectors_url + 'resource/index.php'
            , params: {
                action: 'publish'
                , id: this.menu.record.id
            }
            , listeners: {
                'success': {fn: this.refresh, scope: this}
            }
        });
    },
    unpublishChild: function(btn, e) {
        MODx.Ajax.request({
            url: MODx.config.connectors_url + 'resource/index.php'
            , params: {
                action: 'unpublish'
                , id: this.menu.record.id
            }
            , listeners: {
                'success': {fn: this.refresh, scope: this}
            }
        });
    }
});
Ext.reg('gridclasskey-grid-children', GridClassKey.grid.Children);