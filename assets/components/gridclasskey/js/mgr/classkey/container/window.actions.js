GridClassKey.window.Actions = function(config) {
    config = config || {};

    Ext.apply(config, {
        id: 'gridclasskey-window-actions'
        , url: GridClassKey.config.connectorUrl
        , title: _('actions')
        , baseParams: {
            action: 'mgr/classkey/children/batchactions'
        }
        , closeAction: 'close'
        , labelAlign: 'left'
        , labelWidth: 120
        , record: config.record
        , blankValues: true
        , fields: [
            {
                xtype: 'hidden'
                , name: 'action-parent'
                , value: config.record.parent
            }, {
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
                    var grid = Ext.getCmp('gridclasskey-grid-children');
                    grid.refresh();
                }
            }
        }
    });
    GridClassKey.window.Actions.superclass.constructor.call(this, config);
};
Ext.extend(GridClassKey.window.Actions, MODx.Window, {
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
            var grid = Ext.getCmp('gridclasskey-grid-children');
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
});
Ext.reg('gridclasskey-window-actions', GridClassKey.window.Actions);