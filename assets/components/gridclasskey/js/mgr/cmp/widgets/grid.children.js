GridClassKey.grid.ChildrenCMP = function (config) {
    config = config || {};

    var _this = this,
            actionItems = [],
            checkBoxSelMod = new Ext.grid.CheckboxSelectionModel({
                checkOnly: true
            }),
            toolTipIdx = 0;

    actionItems.push({
        handler: function (grid, row, col) {
            var rec = _this.store.getAt(row);
            rec.data['show_in_tree'] = Number(!rec.data['show_in_tree']);
            _this.showInTree(rec.data);
        },
        getClass: function (v, meta, rec) {
            if (rec.get('show_in_tree')) {
                this.items[0].tooltip = _('gridclasskey.hide_in_tree');
                this.items[0].altText = _('gridclasskey.hide_in_tree');
                return 'icon-gridclasskey-table icon-gridclasskey-actioncolumn-img';
            } else {
                this.items[0].tooltip = _('gridclasskey.show_in_tree');
                this.items[0].altText = _('gridclasskey.show_in_tree');
                return 'icon-gridclasskey-node_tree icon-gridclasskey-actioncolumn-img';
            }
        }
    });

    if (MODx.perm['edit_document']) {
        ++toolTipIdx;
        actionItems.push({
            iconCls: 'icon-gridclasskey-edit icon-gridclasskey-actioncolumn-img'
            , tooltip: _('edit')
            , altText: _('edit')
            , handler: function (grid, row, col) {
                var rec = this.store.getAt(row);
                MODx.loadPage(MODx.action['resource/update'], 'id=' + rec.get('id'));
            },
            scope: this
        });
    }

    ++toolTipIdx;
    actionItems.push({
        iconCls: 'icon-gridclasskey-view icon-gridclasskey-actioncolumn-img'
        , tooltip: _('view')
        , altText: _('view')
        , handler: function (grid, row, col) {
            var rec = this.store.getAt(row);
            window.open(rec.get('preview_url'));
        },
        scope: this
    });

    if (MODx.perm['publish_document'] && MODx.perm['unpublish_document']) {
        ++toolTipIdx;
        actionItems.push({
            handler: function (grid, row, col) {
                var rec = _this.store.getAt(row);
                _this.publishResource(rec.data);
            },
            getClass: function (v, meta, rec) {
                if (rec.get('published')) {
                    this.items[toolTipIdx].tooltip = _('resource_unpublish');
                    this.items[toolTipIdx].altText = _('resource_unpublish');
                    return 'icon-gridclasskey-mute icon-gridclasskey-actioncolumn-img';
                } else {
                    this.items[toolTipIdx].tooltip = _('resource_publish');
                    this.items[toolTipIdx].altText = _('resource_publish');
                    return 'icon-gridclasskey-publish icon-gridclasskey-actioncolumn-img';
                }
            }
        });
    }

    if (MODx.perm['delete_document'] && MODx.perm['undelete_document']) {
        ++toolTipIdx;
        actionItems.push({
            handler: function (grid, row, col) {
                var rec = _this.store.getAt(row);
                _this.removeResource(rec.data);
            },
            getClass: function (v, meta, rec) {
                if (rec.get('deleted')) {
                    this.items[toolTipIdx].tooltip = _('resource_undelete');
                    this.items[toolTipIdx].altText = _('resource_undelete');
                    return 'icon-gridclasskey-recycle icon-gridclasskey-actioncolumn-img';
                } else {
                    this.items[toolTipIdx].tooltip = _('resource_delete');
                    this.items[toolTipIdx].altText = _('resource_delete');
                    return 'icon-gridclasskey-delete icon-gridclasskey-actioncolumn-img';
                }
                return;
            }
        });
    }

    var topBar = [];
    if (MODx.perm['gridclasskey.batch_actions']) {
        topBar.push({
            text: _('actions')
            , iconCls: 'icon-gridclasskey-check_boxes'
            , handler: function (btn, e) {
                var actionsWindow = new GridClassKey.window.ActionsCMP();
                return actionsWindow.show();
            }
        });
    }

    topBar.push('->');
    topBar.push({
        xtype: 'textfield'
        , id: 'gridclasskey-search-field'
        , emptyText: _('gridclasskey.search...')
        , listeners: {
            'render': {
                fn: function (cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key: Ext.EventObject.ENTER
                        , fn: function () {
                            _this.search(cmp);
                            this.blur();
                            return true;
                        }
                        , scope: cmp
                    });
                }
                , scope: this
            }
        }
    });

    Ext.applyIf(config, {
        id: 'gridclasskey-grid-childrencmp'
        , url: GridClassKey.config.connectorUrl
        , baseParams: {
            action: 'mgr/cmp/children/getlist'
        }
        , fields: ['id', 'parent', 'parent_title', 'pagetitle', 'deleted', 'published', 'action_edit', 'preview_url', 'context_key', 'show_in_tree']
        , paging: true
        , remoteSort: true
        , autoExpandColumn: 'pagetitle'
        , viewConfig: {
            forceFit: true
            , enableRowBody: true
            , scrollOffset: 0
            , autoFill: true
            , showPreview: true
            , getRowClass: function (record, index, rowParams, store) {
                var clsName = 'gridclasskey-row';
                if (record.get('published') === false) {
                    clsName += ' gridclasskey-unpublished';
                }
                if (record.get('deleted') === true) {
                    clsName += ' gridclasskey-deleted';
                }
                if (record.get('hidemenu') === true) {
                    clsName += ' gridclasskey-hidden';
                }
                return clsName;
            }
        }
        , sm: checkBoxSelMod
        , columns: [
            checkBoxSelMod, {
                header: _('id')
                , dataIndex: 'id'
                , sortable: true
                , width: 20
            }, {
                header: _('pagetitle')
                , dataIndex: 'pagetitle'
                , sortable: true
                , renderer: {
                    fn: this._renderPageTitle
                    , scope: this
                }
            }, {
                header: _('parent')
                , dataIndex: 'parent_title'
                , sortable: false
            }, {
                header: _('actions')
                , xtype: 'actioncolumn'
                , dataIndex: 'id'
                , sortable: false
                , editable: false
                , fixed: true
                , width: 130
                , items: actionItems
            }
        ]
        , tbar: topBar
    });
    this._makeTemplates();

    GridClassKey.grid.ChildrenCMP.superclass.constructor.call(this, config);
};

Ext.extend(GridClassKey.grid.ChildrenCMP, MODx.grid.Grid, {
    search: function (tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    , _makeTemplates: function () {
        this.tplPageTitle = new Ext.XTemplate('<tpl for="."><a href="{action_edit}" onclick="return event.button || event.ctrlKey || event.metaKey ? true : (MODx.loadPage(\'{action_edit}\'), false)" title="' + _('edit') + ' {pagetitle}">{pagetitle}</a></tpl>', {
            compiled: true
        });
    }
    , _renderPageTitle: function (v, md, rec) {
        return this.tplPageTitle.apply(rec.data);
    }
    , getMenu: function () {
        var deleteTitle = this.menu.record.deleted ? _('resource_undelete') : _('resource_delete');
        var publishTitle = this.menu.record.published ? _('unpublish') : _('publish');
        return [
            {
                text: _('edit')
                , handler: function (btn, e) {
                    this.updateResource(this.menu.record);
                }
            }, {
                text: _('view')
                , handler: function (btn, e) {
                    window.open(this.menu.record.preview_url);
                }
            }, {
                text: publishTitle
                , handler: function (btn, e) {
                    this.publishResource(this.menu.record);
                }
            }, {
                text: _('resource_duplicate')
                , handler: this.duplicateResource
            }, '-', {
                text: deleteTitle
                , handler: function (btn, e) {
                    this.removeResource(this.menu.record);
                }
            }
        ];
    }
    , updateResource: function (record) {
        MODx.loadPage(MODx.action['resource/update'], 'id=' + record.id);
    }
    , removeResource: function (record) {
        var title = record.deleted ? _('resource_undelete') : _('resource_delete');
        var text = record.deleted ? _('resource_undelete_confirm') : _('resource_delete_confirm');
        var action = record.deleted ? (MODx.version_is22 < 0 ? 'resource/undelete' : 'undelete') : (MODx.version_is22 < 0 ? 'resource/delete' : 'delete');
        MODx.msg.confirm({
            title: title
            , text: text
            , url: MODx.config.connectors_url + (MODx.version_is22 < 0 ? 'index.php' : 'resource/index.php')
            , params: {
                action: action
                , id: record.id
            }
            , listeners: {
                'success': {
                    fn: function (response) {
                        this.refresh();
                        var t = Ext.getCmp('modx-resource-tree');
                        if (t) {
                            var treeNode = t.getNodeById(record.context_key + '_' + record.id);
                            var ui = treeNode.getUI();

                            if (record.deleted) {
                                ui.removeClass('deleted');
                            } else {
                                ui.addClass('deleted');
                            }
                            treeNode.cascade(function (nd) {
                                nd.getUI().addClass('deleted');
                                if (record.deleted) {
                                    nd.getUI().removeClass('deleted');
                                } else {
                                    nd.getUI().addClass('deleted');
                                }
                            }, t);
                            Ext.get(ui.getEl()).frame();
                        }
                    },
                    scope: this
                },
                failure: {
                    fn: function(){},
                    scope: this
                }
            }
        });
    }
    , publishResource: function (record) {
        var action = record.published ? (MODx.version_is22 < 0 ? 'resource/unpublish' : 'unpublish') : (MODx.version_is22 < 0 ? 'resource/publish' : 'publish');
        MODx.Ajax.request({
            url: MODx.config.connectors_url + (MODx.version_is22 < 0 ? 'index.php' : 'resource/index.php')
            , params: {
                action: action
                , id: record.id
            }
            , listeners: {
                'success': {
                    fn: function (response) {
                        this.refresh();
                        var t = Ext.getCmp('modx-resource-tree');
                        if (t) {
                            var treeNode = t.getNodeById(record.context_key + '_' + record.id);
                            var ui = treeNode.getUI();

                            if (record.published) {
                                ui.addClass('unpublished');
                            } else {
                                ui.removeClass('unpublished');
                            }
                            treeNode.cascade(function (nd) {
                                if (record.published) {
                                    nd.getUI().addClass('unpublished');
                                } else {
                                    nd.getUI().removeClass('unpublished');
                                }
                            }, t);
                            Ext.get(ui.getEl()).frame();
                        }
                    },
                    scope: this
                },
                failure: {
                    fn: function(){},
                    scope: this
                }
            }
        });
    }
    , duplicateResource: function (item, e) {
        var r = {
            resource: this.menu.record.id
            , is_folder: this.menu.record.isfolder
        };

        var w = MODx.load({
            xtype: 'modx-window-resource-duplicate'
            , resource: this.menu.record.id
            , hasChildren: this.menu.record.has_children
            , listeners: {
                'success': {fn: this.refresh, scope: this},
                failure: {
                    fn: function(){},
                    scope: this
                }
            }
        });
        w.config.hasChildren = this.menu.record.has_children;
        w.setValues(r);
        w.show(e.target);
    }
    , showInTree: function (record) {
        record['action'] = 'mgr/cmp/children/update';
        MODx.Ajax.request({
            url: GridClassKey.config.connectorUrl
            , params: record
            , listeners: {
                'success': {
                    fn: function (response) {
                        this.refresh();
                        var t = Ext.getCmp('modx-resource-tree');
                        if (t) {
                            var treeNode = t.getNodeById(record.context_key + '_' + record.parent);
                            if (typeof(treeNode) !== 'undefined') {
                                treeNode.reload();
                            }
                        }
                    },
                    scope: this
                },
                'failure': {
                    fn: function (response) {},
                    scope: this
                }
            }
        });
    }
});
Ext.reg('gridclasskey-grid-childrencmp', GridClassKey.grid.ChildrenCMP);