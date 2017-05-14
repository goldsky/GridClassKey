GridClassKey.window.ActionsCMP = function(config) {
    config = config || {};

    Ext.apply(config, {
        title: _('actions')
        , closeAction: 'close'
        , labelAlign: 'left'
        , labelWidth: 120
        , blankValues: true
        , fields: [
            {
                // to be used for selected range
                xtype: 'hidden'
                , name: 'action-selected-range'
            }, {
                xtype: 'radiogroup'
                , fieldLabel: _('gridclasskey.range')
                , columns: 3
                , margins: '0 0 10 0'
                , items: [
                    {
                        boxLabel: _('gridclasskey.selected')
                        , name: 'action-range'
                        , inputValue: 'selected'
                        , checked: true
                    }, {
                        boxLabel: _('gridclasskey.all')
                        , name: 'action-range'
                        , inputValue: 'all'
                    }
                ]
            }, {
                xtype: 'radiogroup'
                , fieldLabel: _('resource_hide_from_menus')
                , columns: 3
                , margins: '0 0 10 0'
                , items: [
                    {
                        boxLabel: _('gridclasskey.none')
                        , name: 'action-hidemenu'
                        , inputValue: ''
                        , checked: true
                    }, {
                        boxLabel: _('gridclasskey.hide')
                        , name: 'action-hidemenu'
                        , inputValue: 'hide'
                    }, {
                        boxLabel: _('gridclasskey.unhide')
                        , name: 'action-hidemenu'
                        , inputValue: 'unhide'
                    }
                ]
            }, {
                xtype: 'radiogroup'
                , fieldLabel: _('gridclasskey.show_in_tree')
                , columns: 3
                , margins: '0 0 10 0'
                , items: [
                    {
                        boxLabel: _('gridclasskey.none')
                        , name: 'action-showintree'
                        , inputValue: ''
                        , checked: true
                    }, {
                        boxLabel: _('gridclasskey.hide')
                        , name: 'action-showintree'
                        , inputValue: 'hide'
                    }, {
                        boxLabel: _('gridclasskey.show')
                        , name: 'action-showintree'
                        , inputValue: 'show'
                    }
                ]
            }, {
                xtype: 'radiogroup'
                , fieldLabel: _('publish')
                , columns: 3
                , margins: '0 0 10 0'
                , items: [
                    {
                        boxLabel: _('gridclasskey.none')
                        , name: 'action-publish'
                        , inputValue: ''
                        , checked: true
                    }, {
                        boxLabel: _('publish')
                        , name: 'action-publish'
                        , inputValue: 'publish'
                    }, {
                        boxLabel: _('unpublish')
                        , name: 'action-publish'
                        , inputValue: 'unpublish'
                    }
                ]
            }, {
                xtype: 'radiogroup'
                , fieldLabel: _('delete')
                , columns: 3
                , margins: '0 0 10 0'
                , items: [
                    {
                        boxLabel: _('gridclasskey.none')
                        , name: 'action-delete'
                        , inputValue: ''
                        , checked: true
                    }, {
                        boxLabel: _('delete')
                        , name: 'action-delete'
                        , inputValue: 'delete'
                    }, {
                        boxLabel: _('undelete')
                        , name: 'action-delete'
                        , inputValue: 'undelete'
                    }
                ]
            }, {
                xtype: 'radio'
                , boxLabel: _('delete') + ' & ' + _('gridclasskey.purge')
                , bodyStyle: 'margin-bottom: 5px;'
                , name: 'action-delete'
                , inputValue: 'purge'
            }, {
                xtype: 'gridclasskey-combo-template'
                , fieldLabel: _('gridclasskey.change_template')
                , anchor: '100%'
                , name: 'action-change-template'
                , hiddenName: 'action-change-template'
                , allowBlank: true
                , enableKeyEvents: true
            }
        ]
        , buttons: [
            {
                text: _('cancel')
                , scope: this
                , handler: function() {
                    config.closeAction !== 'close' ? this.hide() : this.close();
                }
            }, {
                text: _('gridclasskey.go!')
                , scope: this
                , handler: function() {
                    this.prepareActions();
                }
            }
        ]
        , listeners: {
            'beforesubmit': {
                fn: function(values) {
                    return this.doActions(values);
                }
                , scope: this
            },
            success: {
                fn: function() {
                    var grid = Ext.getCmp('gridclasskey-grid-childrencmp');
                    grid.refresh();
                }
            }
        }
    });
    GridClassKey.window.ActionsCMP.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.window.ActionsCMP, MODx.Window, {
    prepareActions: function() {
        var values = this.fp.getForm().getValues();
        if (values['action-delete'] === 'purge') {
            return Ext.Msg.confirm(_('gridclasskey.purge') || _('warning'), _('gridclasskey.purge_confirm'), function(e) {
                if (e == 'yes') {
                    this.submit();
                } else {
                    this.fireEvent('cancel', this.config);
                }
            }, this);
        } else {
            this.submit();
        }
    }
    , doActions: function(values) {
        if (values['action-hidemenu'] === ''
                && values['action-showintree'] === ''
                && values['action-publish'] === ''
                && values['action-delete'] === ''
                && values['action-change-template'] === ''
                ) {
            var errWin = new Ext.Window({
                title: _('error')
                , closeAction: 'hide'
                , width: 300
                , padding: 10
                , items: [{
                        xtype: 'modx-panel'
                        , border: false
                        , height: 100
                        , html: '<p>' + _('gridclasskey.empty_action_err') + '</p>'
                    }]
                , buttons: [{
                        text: _('close')
                        , handler: function() {
                            errWin.closeAction !== 'close' ? errWin.hide() : errWin.close();
                        }
                    }]

            });
            errWin.show();
            return false;
        }
        if (values['action-range'] === 'selected') {
            var grid = Ext.getCmp('gridclasskey-grid-childrencmp');
            var selected = grid.getSelectionModel().getSelections();
            if (selected.length === 0) {
                var errWin = new Ext.Window({
                    title: _('error')
                    , closeAction: 'hide'
                    , width: 300
                    , padding: 10
                    , items: [{
                            xtype: 'modx-panel'
                            , border: false
                            , height: 100
                            , html: '<p>' + _('gridclasskey.selection_err') + '</p>'
                        }]
                    , buttons: [{
                            text: _('close')
                            , handler: function() {
                                errWin.closeAction !== 'close' ? errWin.hide() : errWin.close();
                            }
                        }]

                });
                errWin.show();
                return false;
            }
            var selectedIds = [];
            for (var i = 0, selectedLn = selected.length; i < selectedLn; i++) {
                selectedIds.push(selected[i].id);
            }
            this.fp.getForm().findField('action-selected-range').setValue(JSON.stringify(selectedIds));
        }
    }
    , submit: function(close) {
        close = close === false ? false : true;
        var f = this.fp.getForm();
        if (f.isValid() && this.fireEvent('beforeSubmit', f.getValues())) {
            this.loopActions(f.getValues());
        }
    }
    , loopActions: function(values, limit, start) {
        limit = limit ? limit : 20;
        start = start ? start : 0;
        console.info('limit, start', limit, start);

        var _this = this;
        _this.loadMask();
        var params = Ext.apply({}, {
            action: 'mgr/cmp/children/batchactions',
            record: this.config.record,
            limit: limit,
            start: start
        }, values);
        MODx.Ajax.request({
            url: GridClassKey.config.connectorUrl,
            params: params,
            listeners: {
                'success': {
                    fn: function(response) {
                        _this.config.closeAction !== 'close' ? _this.hide() : _this.close();
                        if (response.success) {
                            var total = response.total - 0; // typecasting
                            if (total > response.nextStart) {
                                // recursive loop
                                _this.loopActions(values, limit, response.nextStart);
                            } else {
                                Ext.getCmp('gridclasskey-grid-childrencmp').refresh();
                                _this.hideMask();
                            }
                        }
                    }
                },
                'failure': {
                    fn: function(response) {
                        _this.hideMask();
                    }
                }
            }
        });
    }
    , loadMask: function() {
        if (!this.loadConverterMask) {
            var domHandler = Ext.getCmp('gridclasskey-grid-childrencmp').body.dom;
            this.loadConverterMask = new Ext.LoadMask(domHandler, {
                msg: _('gridclasskey.please_wait')
            });
        }
        this.loadConverterMask.show();
    }
    , hideMask: function() {
        if (this.loadConverterMask) {
            this.loadConverterMask.hide();
        }
    }

});
Ext.reg('gridclasskey-window-actionscmp', GridClassKey.window.ActionsCMP);