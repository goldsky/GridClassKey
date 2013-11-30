GridClassKey.grid.GridSettings = function(config) {
    config = config || {};

    var data = [
        ['id', 'id', 50, true]
    ];
    if (config.record && config.record.fields) {
        for (var i = 0, l = config.record.fields.length; i < l; i++) {
            if (config.record.fields[i].field === 'id') {
                continue;
            }
            data.push([
                config.record.fields[i].field,
                config.record.fields[i].lexicon,
                config.record.fields[i].width,
                config.record.fields[i].sortable,
                config.record.fields[i].editor_type
            ]);
        }
    }

    Ext.applyIf(config, {
        id: 'gridclasskey-grid-gridsettings'
        , fields: ['field', 'lexicon', 'width', 'sortable', 'editor_type']
        , viewConfig: {
            forceFit: true
            , enableRowBody: true
            , scrollOffset: 0
            , autoFill: true
            , showPreview: true
            , emptyText: config.emptyText || _('gridclasskey.empty')
        }
        , data: data
        , deferredRender: true
        , preventRender: true
        , autoHeight: true
        , columns: [
            {
                header: _('gridclasskey.field')
                , dataIndex: 'field'
                , sortable: true
            }, {
                header: _('lexicon') + ' / ' + _('caption')
                , dataIndex: 'lexicon'
                , sortable: true
                , editor: {
                    type: 'text'
                }
            }, {
                header: _('gridclasskey.width')
                , xtype: 'numbercolumn'
                , format: '0,000'
                , dataIndex: 'width'
                , width: 50
                , editor: {
                    type: 'text'
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
                header: _('gridclasskey.editor_type')
                , dataIndex: 'editor_type'
                , width: 100
                , editor: {
                    type: 'text'
                    , placeHolder: _('gridclasskey.editor_type_placeholder')
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
                        },
                        getClass: function(v, meta, rec) {
                            if (rec.get('field') !== 'id') {
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
            }
        ]
    });
    GridClassKey.grid.GridSettings.superclass.constructor.call(this, config);
    this.doLayout();
};
Ext.extend(GridClassKey.grid.GridSettings, MODx.grid.LocalGrid, {
    revertDefaultData: function(btn, e) {
        var settingsGrid = Ext.getCmp('gridclasskey-grid-gridsettings');
        settingsGrid.data = [
            ['id', 'id', 50, true],
            ['pagetitle', 'pagetitle', 100, true, 'text'],
            ['longtitle', 'gridclasskey.longtitle', 100, true, 'text'],
            ['description', 'description', null, false, 'textarea']
        ];
        settingsGrid.getStore().loadData(settingsGrid.data);
        settingsGrid.getView().refresh();
    }
});
Ext.reg('gridclasskey-grid-gridsettings', GridClassKey.grid.GridSettings);