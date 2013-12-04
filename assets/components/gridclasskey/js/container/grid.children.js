GridClassKey.grid.Children = function(config) {
    config = config || {};

    var defaultFields = [{
            'name': 'id',
            'mapping': 'id'
        }, {
            'name': 'pagetitle',
            'mapping': 'pagetitle'
        }, {
            'name': 'longtitle',
            'mapping': 'longtitle'
        }, {
            'name': 'description',
            'mapping': 'description'
        }, {
            'name': 'deleted',
            'mapping': 'deleted'
        }, {
            'name': 'published',
            'mapping': 'published'
        }, {
            'name': 'hidemenu',
            'mapping': 'hidemenu'
        }, {
            'name': 'publishedon_date',
            'mapping': 'publishedon_date'
        }, {
            'name': 'action_edit',
            'mapping': 'action_edit'
        }, {
            'name': 'preview_url',
            'mapping': 'preview_url'
        }]
            , fields = []
            , defaultColumns = [
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
            , checkBoxSelMod = new Ext.grid.CheckboxSelectionModel({checkOnly: true})
            , columns = [checkBoxSelMod];

    if (config.record.properties
            && config.record.properties.gridclasskey
            && config.record.properties.gridclasskey.fields
            && config.record.properties.gridclasskey.fields.length > 0) {
        for (var i = 0, fieldsLn = config.record.properties.gridclasskey.fields.length; i < fieldsLn; i++) {
            var fieldRecord = config.record.properties.gridclasskey.fields[i];
            fields.push({
                name: fieldRecord.name
                , mapping: fieldRecord.name
            });

            if (typeof (fieldRecord) !== 'object') {
                continue;
            }

            var rowField = {
                header: _(fieldRecord.lexicon) ? _(fieldRecord.lexicon) : (fieldRecord.lexicon ? fieldRecord.lexicon : fieldRecord.name)
                , dataIndex: fieldRecord.name
                , sortable: fieldRecord.sortable
                , hidden: fieldRecord.hidden
                , width: fieldRecord.width
            };

            if (fieldRecord.name !== 'id'
                    && fieldRecord.editor_type
                    && fieldRecord.editor_type !== ''
                    && fieldRecord.output_filter === ''
                    || fieldRecord.output_filter === null
                    ) {
                if (fieldRecord.editor_type === 'text') {
                    fieldRecord.editor_type = 'textfield';
                }
                rowField.editor = {
                    xtype: fieldRecord.editor_type
                };
            }
            if (fieldRecord.name === 'pagetitle') {
                rowField.renderer = {fn: this._renderPageTitle, scope: this};
            }

            columns.push(rowField);

        }
        // Because Ext overrides the default Array, we can not use concat(), and this ExtJS 3 doesn't have Ext.Array singleton!
        if (fields.indexOf({name: 'published', mapping: 'published'}) === -1) {
            fields.push({
                name: 'published'
                , mapping: 'published'
            });
        }
        if (fields.indexOf({name: 'deleted', mapping: 'deleted'}) === -1) {
            fields.push({
                name: 'deleted'
                , mapping: 'deleted'
            });
        }
        if (fields.indexOf({name: 'hidemenu', mapping: 'hidemenu'}) === -1) {
            fields.push({
                name: 'hidemenu'
                , mapping: 'hidemenu'
            });
        }
        fields.push({
            name: 'has_children'
            , mapping: 'has_children'
        });
        fields.push({
            name: 'action_edit'
            , mapping: 'action_edit'
        });
        fields.push({
            name: 'preview_url'
            , mapping: 'preview_url'
        });
    } else {
        fields = defaultFields;
        columns.push(defaultColumns);
    }

    // add the Actions column for the last column
    columns.push({
        header: _('actions')
        , xtype: 'actioncolumn'
        , dataIndex: 'id'
        , sortable: false
        , width: 50
        , items: [
            {
                iconCls: 'icon-gridclasskey-edit icon-gridclasskey-actioncolumn-img'
                , toolTip: _('edit')
                , altText: _('edit')
                , handler: function(grid, row, col) {
                    var rec = this.store.getAt(row);
                    MODx.loadPage(MODx.action['resource/update'], 'id=' + rec.get('id'));
                },
                scope: this
            }, {
                iconCls: 'icon-gridclasskey-view icon-gridclasskey-actioncolumn-img'
                , toolTip: _('view')
                , altText: _('view')
                , handler: function(grid, row, col) {
                    var rec = this.store.getAt(row);
                    window.open(rec.get('preview_url'));
                },
                scope: this
            }, {
                handler: function(grid, row, col) {
                    var _this = Ext.getCmp('gridclasskey-grid-children');
                    var rec = _this.store.getAt(row);
                    _this.removeChild(rec.data);
                },
                getClass: function(v, meta, rec) {
                    if (rec.get('deleted')) {
                        this.items[2].tooltip = _('resource_undelete');
                        this.items[2].altText = _('resource_undelete');
                        return 'icon-gridclasskey-recycle icon-gridclasskey-actioncolumn-img';
                    } else {
                        this.items[2].tooltip = _('resource_delete');
                        this.items[2].altText = _('resource_delete');
                        return 'icon-gridclasskey-delete icon-gridclasskey-actioncolumn-img';
                    }
                }
            }
        ]
    });

    Ext.applyIf(config, {
        id: 'gridclasskey-grid-children'
        , url: GridClassKey.connector_url
        , baseParams: {
            action: 'children/getList'
            , parent: config.record.id
        }
        , fields: fields
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
                if (record.get('hidemenu') === true) {
                    clsName += ' gridclasskey-hidden';
                }
                return clsName;
            }
        }
        , save_action: 'children/updateFromGrid'
        , autosave: true
        , sm: checkBoxSelMod
        , columns: columns
        , tbar: [
            {
                text: _('actions')
                , iconCls: 'icon-gridclasskey-check_boxes'
                , handler: function(btn, e) {
                    var actionsWindow = new GridClassKey.window.Actions({
                        record: {
                            parent: config.record.id
                        }
                    });
                    return actionsWindow.show();
                }
            }, {
                text: config.record['gridclasskey-property-grid-addnewdocbtn-text'] || _('gridclasskey.document_new')
                , id: 'gridclasskey-property-grid-addnewdocbtn'
                , iconCls: 'icon-gridclasskey-document-new'
                , handler: function(itm, e) {
                    Ext.getCmp('modx-resource-tree').loadAction(
                            'a=' + MODx.action['resource/create']
                            + '&parent=' + config.record.id
                            + (config.record.context_key ? '&context_key=' + config.record.context_key : '')
                            + (config.record.properties
                                    && config.record.properties.gridclasskey
                                    && config.record.properties.gridclasskey['child-template']
                                    ? '&template=' + config.record.properties.gridclasskey['child-template']
                                    : '')
                            );
                }
            }, '->', {
                xtype: 'textfield'
                , id: 'gridclasskey-search-field'
                , emptyText: _('gridclasskey.search...')
                , listeners: {
                    'render': {
                        fn: function(cmp) {
                            var _this = this;
                            new Ext.KeyMap(cmp.getEl(), {
                                key: Ext.EventObject.ENTER
                                , fn: function() {
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
            }, {
                text: _('gridclasskey.advanced_search')
                , iconCls: 'icon-gridclasskey-filter'
                , handler: function(btn, e) {
                    var searchField = Ext.getCmp('gridclasskey-search-field');
                    searchField.setDisabled(true);
                    var advSearchWin = MODx.load({
                        xtype: 'gridclasskey-window-advancedsearch'
                        , parent: config.record.id
                        , query: searchField.getValue()
                    });
                    searchField.reset();
                    advSearchWin.show();
                }
            }, {
                xtype: 'button'
                , text: _('gridclasskey.clear')
                , iconCls: 'icon-gridclasskey-filter-delete'
                , handler: function(btn, e) {
                    var searchField = Ext.getCmp('gridclasskey-search-field');
                    searchField.reset();
                    searchField.setDisabled(false);

                    var s = this.getStore();
                    s.baseParams.query = '';
                    s.baseParams.template = '';
                    s.baseParams.fields = '';
                    this.getBottomToolbar().changePage(1);
                    this.refresh();
                }
                , scope: this
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
    }
    , getMenu: function() {
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
            }, {
                text: _('resource_duplicate')
                , handler: this.duplicateResource
            }, '-', {
                text: deleteTitle
                , handler: function(btn, e) {
                    this.removeChild(this.menu.record);
                }
            }
        ];
        return menu;
    }
    , updateChild: function(record) {
        MODx.loadPage(MODx.action['resource/update'], 'id=' + record.id);
    }
    , removeChild: function(record) {
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
    }
    , _makeTemplates: function() {
        this.tplPageTitle = new Ext.XTemplate('<tpl for="."><a href="{action_edit}" title="' + _('edit') + ' {pagetitle}">{pagetitle}</a></tpl>', {
            compiled: true
        });
    }
    , _renderPageTitle: function(v, md, rec) {
        return this.tplPageTitle.apply(rec.data);
    }
    , publishChild: function(btn, e) {
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
    }
    , unpublishChild: function(btn, e) {
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
    , duplicateResource: function(item, e) {
        var r = {
            resource: this.menu.record.id
            , is_folder: this.menu.record.isfolder
        };
        console.log('this.menu.record', this.menu.record);
        var w = MODx.load({
            xtype: 'modx-window-resource-duplicate'
            , resource: this.menu.record.id
            , hasChildren: this.menu.record.has_children
            , listeners: {
                'success': {fn: this.refresh, scope: this}
            }
        });
        w.config.hasChildren = this.menu.record.has_children;
        w.setValues(r);
        w.show(e.target);
    }
});
Ext.reg('gridclasskey-grid-children', GridClassKey.grid.Children);