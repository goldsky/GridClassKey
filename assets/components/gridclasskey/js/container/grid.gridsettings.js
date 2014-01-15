GridClassKey.grid.GridSettings = function(config) {
    config = config || {};

    var data = [];

    if (config.record
            && config.record.properties
            && config.record.properties.gridclasskey
            && config.record.properties.gridclasskey.fields
            ) {

        var hasID = false;
        Ext.each(config.record.properties.gridclasskey.fields, function(item, idx) {
            if (item.name === 'id') {
                hasID = true;
                return false;
            }
        });
        if (!hasID) {
            data.push(['id', 'id', 50, true]);
        }
        Ext.each(config.record.properties.gridclasskey.fields, function(fieldRecord, idx) {
            data.push([
                idx+1,
                fieldRecord.name,
                fieldRecord.lexicon,
                fieldRecord.width,
                fieldRecord.sortable,
                fieldRecord.hidden,
                fieldRecord.editor_type,
                fieldRecord.output_filter
            ]);
        });
    } else {
        data = [
            [1, 'id', 'id', 50, true, false],
            [2, 'pagetitle', 'pagetitle', 100, true, false, 'textfield'],
            [3, 'longtitle', 'gridclasskey.longtitle', 100, true, false, 'textfield'],
            [4, 'description', 'description', 200, false, false, 'textarea']
        ];
    }

    Ext.apply(config, {
        id: 'gridclasskey-grid-gridsettings'
        , fields: ['sort', 'name', 'lexicon', 'width', 'sortable', 'hidden', 'editor_type', 'output_filter']
        , sortInfo: {field: 'sort', direction: 'asc'}
        , viewConfig: {
            forceFit: true
            , enableRowBody: true
            , scrollOffset: 0
            , autoFill: true
            , showPreview: true
            , emptyText: config.emptyText || _('gridclasskey.empty')
        }
        , enableDragDrop: true
        , enableColumnMove: false
        , sm: new Ext.grid.RowSelectionModel({
            singleSelect: true
        })
        , data: data
        , deferredRender: true
        , preventRender: true
        , autoHeight: true
        , autoExpandColumn: 'lexicon'
        , columns: [
            {
                header: _('gridclasskey.sort')
                , dataIndex: 'sort'
                , sortable: true
                , width: 50
                , editable: false
            }, {
                header: _('name')
                , dataIndex: 'name'
            }, {
                header: _('lexicon') + ' / ' + _('caption')
                , dataIndex: 'lexicon'
                , editor: {
                    type: 'textfields'
                }
            }, {
                header: _('gridclasskey.width')
                , xtype: 'numbercolumn'
                , format: '0,000'
                , dataIndex: 'width'
                , width: 50
                , editor: {
                    type: 'textfields'
                }
            }, {
                header: _('gridclasskey.sortable')
                , xtype: 'booleancolumn'
                , dataIndex: 'sortable'
                , width: 50
                , trueText: _('yes')
                , falseText: _('no')
                , editor: {
                    xtype: 'modx-combo-boolean'
                    , width: 50
                    , listWidth: 100
                }
            }, {
                header: _('gridclasskey.hidden')
                , xtype: 'booleancolumn'
                , dataIndex: 'hidden'
                , width: 50
                , trueText: _('yes')
                , falseText: _('no')
                , editor: {
                    xtype: 'modx-combo-boolean'
                    , width: 50
                    , listWidth: 100
                }
            }, {
                header: _('gridclasskey.editor_type')
                , dataIndex: 'editor_type'
                , width: 100
                , editor: {
                    type: 'textfields'
                }
            }, {
                header: _('gridclasskey.output_filter')
                , description: _('gridclasskey.output_filter_desc')
                , dataIndex: 'output_filter'
                , width: 100
                , editor: {
                    type: 'textfields'
                }
            }, {
                header: _('gridclasskey.actions')
                , xtype: 'actioncolumn'
                , dataIndex: 'id'
                , editable: false
                , width: 50
                , fixed: true
                , items: [
                    {
                        handler: function(grid, row, col) {
                            var _this = Ext.getCmp('gridclasskey-grid-gridsettings'),
                                    rec = _this.store.getAt(row),
                                    dataLn = _this.data.length,
                                    newArr = [], i;
                            for (i = 0; i < dataLn; i++) {
                                if (i === row) {
                                    continue;
                                }
                                newArr.push(_this.data[i]);
                            }
                            _this.data = newArr;
                            _this.getStore().loadData(_this.data);
                            _this.getView().refresh();

                            var btn = Ext.getCmp('modx-abtn-save');
                            if (btn) {
                                btn.enable();
                            }
                        },
                        getClass: function(v, meta, rec) {
                            if (rec.get('name') !== 'id') {
                                this.items[0].tooltip = _('delete');
                                this.items[0].altText = _('delete');
                                return 'icon-gridclasskey-delete icon-gridclasskey-actioncolumn-img';
                            }
                        }
                    }
                ]
            }
        ]
        , bbar: [
            '->', {
                text: _('gridclasskey.back_to_default')
                , handler: this.revertDefaultData
                , scope: this
            }
        ]
        , listeners: {
            'celldblclick': {
                fn: function(grid, rowIndex, columnIndex, e) {
                    Ext.getCmp('modx-panel-resource').markDirty();
                    var btn = Ext.getCmp('modx-abtn-save');
                    if (btn) {
                        btn.enable();
                    }
                }
                , scope: this
            }
            , render: this.initializelDragDropZone
        }
    });

    GridClassKey.grid.GridSettings.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.grid.GridSettings, MODx.grid.LocalGrid, {
    revertDefaultData: function(btn, e) {
        this.data = [
            [1, 'id', 'id', 50, true, false],
            [2, 'pagetitle', 'pagetitle', 100, true, false, 'textfield'],
            [3, 'longtitle', 'gridclasskey.longtitle', 100, true, false, 'textfield'],
            [4, 'description', 'description', 200, false, false, 'textarea']
        ];
        this.getStore().loadData(this.data);
        this.getView().refresh();

        var btn = Ext.getCmp('modx-abtn-save');
        if (btn) {
            btn.enable();
        }
    },
    initializelDragDropZone: function(gridPanel) {
        this.dragZone = new Ext.dd.DragZone(gridPanel.getEl(), {
            getDragData: function(e) {
                var rowEl = e.getTarget(gridPanel.getView().rowSelector, 10);
                var sourceEl = Ext.select('div.x-grid3-col-1', true, rowEl).elements[0].dom;
                if (rowEl && sourceEl) {
                    var d = sourceEl.cloneNode(true);
                    d.id = Ext.id();
                    return {
                        ddel: d,
                        sourceEl: sourceEl,
                        repairXY: Ext.fly(sourceEl).getXY(),
                        sourceStore: gridPanel.store,
                        draggedRecord: rowEl
                    };
                }
            },
            getRepairXY: function() {
                return this.dragData.repairXY;
            }
        });

        this.dropZone = new Ext.dd.DropZone(gridPanel.getView().scroller, {
            getTargetFromEvent: function(e) {
                return e.getTarget(gridPanel.getView().rowSelector);
            },
            onNodeOver: function(target, dd, e, data) {
                return Ext.dd.DropZone.prototype.dropAllowed;
            },
            onNodeDrop: function(target, dd, e, data) {
                var targetRowIndex = gridPanel.getView().findRowIndex(target);
                var draggedRowIndex = gridPanel.getView().findRowIndex(data.draggedRecord);
                var isSteppingUp = (targetRowIndex < draggedRowIndex);
                var newData = gridPanel.data; // initial fills
                var draggedData = gridPanel.data[draggedRowIndex];
                if (isSteppingUp) {
                    for (var i = draggedRowIndex; i > targetRowIndex; i--) {
                        var item = gridPanel.data[i - 1];
                        item[0] = i + 1;
                        newData[i] = item;
                    }
                } else {
                    for (var i = draggedRowIndex; i < targetRowIndex; i++) {
                        var item = gridPanel.data[i + 1];
                        item[0] = i + 1;
                        newData[i] = item;
                    }
                }
                draggedData[0] = targetRowIndex + 1;
                newData[targetRowIndex] = draggedData;

                gridPanel.getStore().loadData(newData);
                gridPanel.getView().refresh();
                Ext.getCmp('modx-panel-resource').markDirty();
                var btn = Ext.getCmp('modx-abtn-save');
                if (btn) {
                    btn.enable();
                }
                return true;
            }
        });
    }
});
Ext.reg('gridclasskey-grid-gridsettings', GridClassKey.grid.GridSettings);