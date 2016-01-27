GridClassKey.grid.Children = function (config) {
    config = config || {};

    var _this = this;
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
            'name': 'context_key',
            'mapping': 'context_key'
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
                    , width: 75
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
                    , width: 200
                    , editor: {
                        xtype: 'textarea'
                    }
                }
            ]
            , checkBoxSelMod = new Ext.grid.CheckboxSelectionModel({
                checkOnly: true
            })
            , columns = [checkBoxSelMod];

    if (config.record.properties
            && config.record.properties.gridclasskey
            && config.record.properties.gridclasskey.fields
            && config.record.properties.gridclasskey.fields.length > 0) {

        Ext.each(config.record.properties.gridclasskey.fields, function (fieldRecord) {
            fields.push({
                name: fieldRecord.name
                , mapping: fieldRecord.name
            });

            if (typeof (fieldRecord) !== 'object') {
                return;
            }

            var rowField = {
                header: _(fieldRecord.lexicon) ? _(fieldRecord.lexicon) : (fieldRecord.lexicon ? fieldRecord.lexicon : fieldRecord.name)
                , dataIndex: fieldRecord.name
                , sortable: fieldRecord.sortable
                , hidden: fieldRecord.hidden
                , fixed: fieldRecord.fixed
            };
            var width = fieldRecord.width - 0; // typecasting
            if (width > 0) {
                rowField.width = width;
            } else {
                rowField.width = 75;
            }
            if (fieldRecord.name !== 'id'
                    && fieldRecord.editor_type
                    && fieldRecord.editor_type !== ''
                    && fieldRecord.output_filter === ''
                    || fieldRecord.output_filter === null
                    ) {
                // @link https://github.com/goldsky/GridClassKey/issues/104#issuecomment-52289593
                //First we check if this is maybe a JSON record
                var jsonData = null;
                try {
                    jsonData = Ext.decode(fieldRecord.editor_type);
                } catch (e) {
                    //Nothing to do, we just know it's not JSON record
                }
                if (jsonData !== null) {
                    //We assign the editor_type back to it's type to check if it is registered
                    fieldRecord.editor_type = jsonData.xtype;
                }
                if (Ext.ComponentMgr.isRegistered(fieldRecord.editor_type)) {
                    if (jsonData !== null) {
                        //We have an editor object
                        rowField.editor = jsonData;
                    } else {
                        rowField.editor = {
                            xtype: fieldRecord.editor_type
                        };
                    }
                } else {
                    rowField.editor = {
                        xtype: 'textfield'
                    };
                }
            }
            if (fieldRecord.name === 'pagetitle') {
                rowField.renderer = {fn: _this._renderPageTitle, scope: _this};
            }
            if (fieldRecord.type === 'tv') {
                fields.push({
                    name: fieldRecord.name + '_output'
                    , mapping: fieldRecord.name + '_output'
                });
                rowField.renderer = function (v, md, rec) {
                    return rec.data[fieldRecord.name + '_output'];
                };
            }
            columns.push(rowField);
        });

        // Because Ext overrides the default Array, we can not use concat(), and this ExtJS 3 doesn't have Ext.Array singleton!
        if (fields.indexOf({name: 'context_key', mapping: 'context_key'}) === -1) {
            fields.push({
                name: 'context_key'
                , mapping: 'context_key'
            });
        }
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
        Ext.each(defaultColumns, function (item, idx) {
            columns.push(item);
        });
    }

    var actionItems = [];

    if (MODx.perm['edit_document']) {
        actionItems.push({
            iconCls: 'icon-gridclasskey-edit icon-gridclasskey-actioncolumn-img'
            , tooltip: _('edit')
            , altText: _('edit')
            , handler: function (grid, row, col) {
                var rec = this.store.getAt(row);
                MODx.loadPage(MODx.action['resource/update'], 'id=' + rec.get('id'));
            },
            scope: this
        }, {
            iconCls: 'icon-gridclasskey-view icon-gridclasskey-actioncolumn-img'
            , tooltip: _('view')
            , altText: _('view')
            , handler: function (grid, row, col) {
                var rec = this.store.getAt(row);
                window.open(rec.get('preview_url'));
            },
            scope: this
        });
    }

    if (MODx.perm['publish_document'] && MODx.perm['unpublish_document']) {
        actionItems.push({
            handler: function (grid, row, col) {
                var rec = _this.store.getAt(row);
                _this.publishResource(rec.data);
            },
            getClass: function (v, meta, rec) {
                if (rec.get('published')) {
                    this.items[2].tooltip = _('resource_unpublish');
                    this.items[2].altText = _('resource_unpublish');
                    return 'icon-gridclasskey-mute icon-gridclasskey-actioncolumn-img';
                } else {
                    this.items[2].tooltip = _('resource_publish');
                    this.items[2].altText = _('resource_publish');
                    return 'icon-gridclasskey-publish icon-gridclasskey-actioncolumn-img';
                }
            }
        });
    }

    if (MODx.perm['delete_document'] && MODx.perm['undelete_document']) {
        actionItems.push({
            handler: function (grid, row, col) {
                var rec = _this.store.getAt(row);
                _this.removeResource(rec.data);
            },
            getClass: function (v, meta, rec) {
                if (rec.get('deleted')) {
                    this.items[3].tooltip = _('resource_undelete');
                    this.items[3].altText = _('resource_undelete');
                    return 'icon-gridclasskey-recycle icon-gridclasskey-actioncolumn-img';
                } else {
                    this.items[3].tooltip = _('resource_delete');
                    this.items[3].altText = _('resource_delete');
                    return 'icon-gridclasskey-delete icon-gridclasskey-actioncolumn-img';
                }
                return;
            }
        });
    }

    if (actionItems.length > 0) {
        // add the Actions column for the last column
        columns.push({
            header: _('actions')
            , xtype: 'actioncolumn'
            , dataIndex: 'id'
            , sortable: false
            , editable: false
            , fixed: true
            , width: 107
            , items: actionItems
        });
    }

    var limit = config.record.properties
            && config.record.properties.gridclasskey
            && config.record.properties.gridclasskey['grid-default_per_page']
            ? config.record.properties.gridclasskey['grid-default_per_page'] - 0
            : 0;

    var topBar = [];
    if (MODx.perm['gridclasskey.batch_actions']) {
        topBar.push({
            text: _('actions')
            , iconCls: 'icon-gridclasskey-check_boxes'
            , handler: function (btn, e) {
                var actionsWindow = new GridClassKey.window.Actions({
                    record: {
                        parent: config.record.id
                    }
                });
                return actionsWindow.show();
            }
        });
    }
    if (MODx.perm['new_document']) {
        topBar.push(
                new Ext.Toolbar.SplitButton({
                    text: config.record['gridclasskey-property-grid-addnewdocbtn-text'] || _('gridclasskey.document_new')
                    , id: 'gridclasskey-property-grid-addnewdocbtn'
                    , iconCls: 'icon-gridclasskey-document-new'
                    , handler: function (itm, e) {
                        Ext.getCmp('modx-resource-tree').loadAction(
                                'a=' + MODx.action['resource/create']
                                + '&parent=' + config.record.id
                                + (config.record.context_key ? '&context_key=' + config.record.context_key : '')
                                + (config.record.properties
                                        && config.record.properties.gridclasskey
                                        && config.record.properties.gridclasskey['child-template']
                                        ? '&template=' + config.record.properties.gridclasskey['child-template']
                                        : '')
                                + (config.record.properties
                                        && config.record.properties.gridclasskey
                                        && config.record.properties.gridclasskey['child-class_key']
                                        ? '&class_key=' + config.record.properties.gridclasskey['child-class_key']
                                        : '')
                                );
                    }
                    , menu: {
                        items: [{
                            text: config.record['gridclasskey-property-grid-quickaddnewdocbtn-text'] || _('gridclasskey.document_new_quick')
                            , id: 'gridclasskey-property-grid-quickaddnewdocbtn'
                            , iconCls: 'icon-gridclasskey-document-new'
                            , handler: this.quickCreate
                            , scope: this
                        }]
                    }
                }));
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
    if (MODx.perm['gridclasskey.advanced_search']) {
        topBar.push({
            text: _('gridclasskey.advanced_search')
            , iconCls: 'icon-gridclasskey-filter'
            , handler: function (btn, e) {
                var searchField = Ext.getCmp('gridclasskey-search-field');
                searchField.setDisabled(true);
                searchField.reset();
                var advSearchWin = MODx.load({
                    xtype: 'gridclasskey-window-advancedsearch'
                    , parent: config.record.id
                });
                this.getStore().baseParams.query = '';
                advSearchWin.fp.getForm().reset();
                advSearchWin.show();
            }
            , scope: this
        });
        topBar.push({
            xtype: 'button'
            , text: _('gridclasskey.clear')
            , iconCls: 'icon-gridclasskey-filter-delete'
            , handler: function (btn, e) {
                var searchField = Ext.getCmp('gridclasskey-search-field');
                searchField.reset();
                searchField.setDisabled(false);

                var s = this.getStore();
                s.baseParams.query = '';
                s.baseParams.advancedSearch = false;
                s.baseParams.template = '';
                s.baseParams.fields = '';
                this.getBottomToolbar().changePage(1);
                this.refresh();
            }
            , scope: this
        });
    }
    Ext.apply(config, {
        id: 'gridclasskey-grid-children'
        , url: GridClassKey.config.connectorUrl
        , baseParams: {
            action: 'mgr/classkey/children/getList'
            , parent: config.record.id
        }
        , fields: fields
        , paging: true
        , pageSize: limit
        , remoteSort: true
        , enableColumnMove: false
        , enableDragDrop: true
        , ddGroup: 'gridclasskey-grid-children-dd'
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
        , save_action: 'mgr/classkey/children/updateFromGrid'
        , autosave: true
        , preventSaveRefresh: false
        , sm: checkBoxSelMod
        , columns: columns
        , tbar: topBar
        , listeners: {
            render: this.attachDragDropZone
        }
    });

    GridClassKey.grid.Children.superclass.constructor.call(this, config);
    this._makeTemplates();
    this.dropTarget = null;
};

Ext.extend(GridClassKey.grid.Children, MODx.grid.Grid, {
    search: function (tf, nv, ov) {
        var s = this.getStore();
        s.baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    , _makeTemplates: function () {
        /**
         * @link    http://modx.com/extras/package/ajaxmanager
         * @see     https://github.com/goldsky/GridClassKey/pull/53/files#r11042161
         */
        this.tplPageTitle = new Ext.XTemplate('<tpl for="."><a href="{action_edit}" onclick="return event.button || event.ctrlKey || event.metaKey ? true : (MODx.loadPage(\'{action_edit}\'), false)" title="' + _('edit') + ' {pagetitle}" class="gridclasskey-pagetitle">{pagetitle}</a></tpl>', {
            compiled: true
        });
    }
    , _renderPageTitle: function (v, md, rec) {
        return this.tplPageTitle.apply(rec.data);
    }
    , getMenu: function () {
        var deleteTitle = this.menu.record.deleted ? _('resource_undelete') : _('resource_delete');
        var publishTitle = this.menu.record.published ? _('unpublish') : _('publish');
        var menu = [
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
        return menu;
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
                    fn: this.refresh,
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
                'success': {fn: this.refresh, scope: this}
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
                'success': {fn: this.refresh, scope: this}
            }
        });
        w.config.hasChildren = this.menu.record.has_children;
        w.setValues(r);
        w.show(e.target);
    }
    , attachDragDropZone: function (gridPanel) {
        var _this = this;
        this.dropTarget = new Ext.dd.DropTarget(gridPanel.container, {
            ddGroup: 'gridclasskey-grid-children-dd'
            , copy: false
            , notifyDrop: function (dd, e, data) {
                if (!_this.enableDragDrop || !data.selections || data.selections.length === 0) {
                    return false;
                }

                var ds = gridPanel.store;
                var sm = gridPanel.getSelectionModel();
                var rows = sm.getSelections();
                var dragData = dd.getDragData(e);
                if (dragData) {
                    var cindex = dragData.rowIndex;
                    if (typeof (cindex) !== "undefined") {
                        var target = ds.getAt(cindex);
                        var dragIds = [];
                        for (var i = 0; i < rows.length; i++) {
                            ds.remove(ds.getById(rows[i].id));
                            dragIds.push(rows[i].id);
                        }
                        ds.insert(cindex, data.selections);
                        sm.clearSelections();
                        _this.sortMenuIndex(target.id, dragIds);
                        return true;
                    }
                }
            }
            , notifyOver: function (dd, e, data) {
                return (_this.enableDragDrop && data.selections && data.selections.length > 0) ? this.dropAllowed : this.dropNotAllowed;
            }
            , notifyEnter: function (dd, e, data) {
                return (_this.enableDragDrop && data.selections && data.selections.length > 0) ? this.dropAllowed : this.dropNotAllowed;
            }
        });
        this.getStore().on('load', function (store) {
            var jsonData = store.reader.jsonData;
            if (jsonData.sortby === 'menuindex') {
                _this.enableDragDrop = true;
            } else {
                _this.enableDragDrop = false;
            }
            // override sorting if clicking the header
            var sortInfo = store.getSortState();
            if (typeof (sortInfo) !== 'undefined') {
                if (sortInfo.field === 'menuindex') {
                    _this.enableDragDrop = true;
                } else {
                    _this.enableDragDrop = false;
                }
            }
        });
    }
    , sortMenuIndex: function (targetId, movingIds) {
        var sortdir, store = this.getStore();
        var sortInfo = store.getSortState();
        if (sortInfo) {
            sortdir = sortInfo.direction;
        } else {
            var jsonData = store.reader.jsonData;
            sortdir = jsonData.sortdir;
        }
        MODx.Ajax.request({
            url: GridClassKey.config.connectorUrl
            , params: {
                action: 'mgr/classkey/children/sortmenuindex'
                , parent: this.config.record.id
                , targetId: targetId
                , movingIds: movingIds.join()
                , sortdir: sortdir
            }
            , listeners: {
                'success': {fn: this.refresh, scope: this}
            }
        });
    }
    , detachDragDropZone: function (gridPanel) {

    }
    , beforeDestroy: function () {
        if (this.rendered) {
            this.dropTarget.destroy();
        }
        GridClassKey.grid.Children.superclass.beforeDestroy.call(this);
    }
    , getSetting: function(key, dv) {
        var val = dv || null;
        if (this.config.record &&
                this.config.record.properties &&
                this.config.record.properties.gridclasskey &&
                this.config.record.properties.gridclasskey[key]) {
            val = this.config.record.properties.gridclasskey[key];
        }
        return val;
    }
    , quickCreate: function (item, e) {
        var r = {
            class_key: this.getSetting('child-class_key', 'modDocument')
            , context_key: this.config.record.context_key || 'web'
            , 'parent': this.config.record.id || 0
            , 'template': parseInt(this.getSetting('child-template', MODx.config.default_template))
            , 'richtext': parseInt(this.getSetting('child-richtext', MODx.config.richtext_default))
            , 'hidemenu': parseInt(this.getSetting('child-hidemenu', MODx.config.hidemenu_default))
            , 'searchable': parseInt(this.getSetting('child-searchable', MODx.config.search_default))
            , 'cacheable': parseInt(this.getSetting('child-cacheable', MODx.config.cache_default))
            , 'published': parseInt(this.getSetting('child-published', MODx.config.publish_default))
            , 'content_type': parseInt(this.getSetting('child-content_type', MODx.config.default_content_type))
        };
        var w = MODx.load({
            xtype: 'modx-window-quick-create-modResource'
            , record: r
            , listeners: {
                'success': {
                    fn: this.refresh
                    , scope: this
                }
                , 'hide': {
                    fn: function () {
                        this.destroy();
                    }}
                , 'show': {
                    fn: function () {
                        this.center();
                    }}
            }
        });
        w.setValues(r);
        w.show(e.target, function () {
            Ext.isSafari ? w.setPosition(null, 30) : w.center();
        }, this);
    }
});
Ext.reg('gridclasskey-grid-children', GridClassKey.grid.Children);