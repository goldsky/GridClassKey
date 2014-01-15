GridClassKey.grid.AdvancedSearch = function(config) {
    config = config || {};

    Ext.apply(config, {
        id: 'gridclasskey-grid-advancedsearch'
        , fields: ['sort', 'name', 'value']
        , viewConfig: {
            forceFit: true
            , enableRowBody: true
            , scrollOffset: 0
            , autoFill: true
            , showPreview: true
            , emptyText: config.emptyText || _('gridclasskey.empty')
        }
        , enableDragDrop: true
        , data: []
        , deferredRender: true
        , preventRender: true
        , autoHeight: true
        , columns: [
            {
                header: _('name')
                , dataIndex: 'name'
                , sortable: true
            }, {
                header: _('value')
                , dataIndex: 'value'
                , sortable: true
                , editor: {
                    type: 'textfields'
                }
            }, {
                header: _('gridclasskey.actions')
                , xtype: 'actioncolumn'
                , dataIndex: 'name'
                , width: 50
                , items: [
                    {
                        iconCls: 'icon-gridclasskey-delete icon-gridclasskey-actioncolumn-img'
                        , altText: _('delete')
                        , tooltip: _('delete')
                        , handler: function(grid, row, col) {
                            var rec = this.store.getAt(row),
                                    dataLn = this.data.length,
                                    newArr = [], i;
                            for (i = 0; i < dataLn; i++) {
                                if (i === row) {
                                    continue;
                                }
                                newArr.push(this.data[i]);
                            }
                            this.data = newArr;
                            this.getStore().loadData(this.data);
                            this.getView().refresh();
                        }
                        , scope: this
                    }
                ]
            }
        ]
        , bbar: [
            '->', {
                text: _('gridclasskey.clear')
                , handler: this.clearGrid
                , scope: this
            }
        ]
    });

    GridClassKey.grid.AdvancedSearch.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.grid.AdvancedSearch, MODx.grid.LocalGrid, {
    clearGrid: function(btn, e) {
        this.data = [];
        this.getStore().loadData(this.data);
        this.getView().refresh();
    }
});
Ext.reg('gridclasskey-grid-advancedsearch', GridClassKey.grid.AdvancedSearch);