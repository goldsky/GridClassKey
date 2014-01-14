GridClassKey.grid.GridSettings = function(config) {
    config = config || {};

    var data = [];

    if (config.record
            && config.record.properties
            && config.record.properties.gridclasskey
            && config.record.properties.gridclasskey.fields
            ) {

        var hasID = false;
        Ext.each(config.record.properties.gridclasskey.fields, function(item, idx){
            if (item.name === 'id') {
                hasID = true;
                return false;
            }
        });
        if (!hasID) {
            data.push(['id', 'id', 50, true]);
        }
        Ext.each(config.record.properties.gridclasskey.fields, function(fieldRecord, idx){
            data.push([
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
            ['id', 'id', 50, true, false],
            ['pagetitle', 'pagetitle', 100, true, false, 'textfield'],
            ['longtitle', 'gridclasskey.longtitle', 100, true, false, 'textfield'],
            ['description', 'description', null, false, false, 'textarea']
        ];
    }

    Ext.apply(config, {
        id: 'gridclasskey-grid-gridsettings'
        , fields: ['name', 'lexicon', 'width', 'sortable', 'hidden', 'editor_type', 'output_filter']
        , viewConfig: {
            forceFit: true
            , enableRowBody: true
            , scrollOffset: 0
            , autoFill: true
            , showPreview: true
            , emptyText: config.emptyText || _('gridclasskey.empty')
        }
        , enableDragDrop: true
        , data: data
        , deferredRender: true
        , preventRender: true
        , autoHeight: true
        , columns: [
            {
                header: _('name')
                , dataIndex: 'name'
                , sortable: true
            }, {
                header: _('lexicon') + ' / ' + _('caption')
                , dataIndex: 'lexicon'
                , sortable: true
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
                , width: 80
                , editor: {
                    type: 'textfields'
                }
            }, {
                header: _('gridclasskey.actions')
                , xtype: 'actioncolumn'
                , dataIndex: 'id'
                , width: 50
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
        }
    });

    GridClassKey.grid.GridSettings.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.grid.GridSettings, MODx.grid.LocalGrid, {
    revertDefaultData: function(btn, e) {
        this.data = [
            ['id', 'id', 50, true, false],
            ['pagetitle', 'pagetitle', 100, true, false, 'textfield'],
            ['longtitle', 'gridclasskey.longtitle', 100, true, false, 'textfield'],
            ['description', 'description', null, false, false, 'textarea']
        ];
        this.getStore().loadData(this.data);
        this.getView().refresh();

        var btn = Ext.getCmp('modx-abtn-save');
        if (btn) {
            btn.enable();
        }
    }
});
Ext.reg('gridclasskey-grid-gridsettings', GridClassKey.grid.GridSettings);