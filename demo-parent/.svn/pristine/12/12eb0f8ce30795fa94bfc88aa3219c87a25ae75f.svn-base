/**
 * Created by cRazy on 2016/6/20.
 */
Ext.define('Cxt.form.field.ComboGridBox', {
    extend: 'Cxt.form.field.SingleTagField',
    xtype: 'combogrid',

    requires: [
        'Ext.grid.Panel',
        'Ext.toolbar.Paging'
    ],

    /**
     * @cfg {Object} grid
     * 使用者需要设置grid的列与工具栏
     */
    grid: undefined,

    initComponent: function () {
        var me = this;
        if (!me.grid) {
            console.error('grid未设置');
        } else if (me.grid.width) {
            me.matchFieldWidth = false;
        }

        me.callParent();
    },

    afterRender: function () {
        var me = this;

        me.callParent();
        me.on('keydown', this.onKeyDown, this);
        me.getStore().on('load', function () {
            me.doAutoSelect();
        });
    },

    onKeyDown: function (e) {
        var me = this,
            key = e.getKey(),
            table = me.getPicker().getView(),
            navigationModel = table.getNavigationModel(),
            position = navigationModel.getPosition();
        if (!position)
            return me.callParent(arguments);

        if (key === e.LEFT) {
            position = table.walkCells(position, 'left');
        } else if (key === e.RIGHT) {
            position = table.walkCells(position, 'right');
        } else if (key === e.UP) {
            position = table.walkCells(position, 'up');
        } else if (key === e.DOWN) {
            position = table.walkCells(position, 'down');
        } else if (key === e.HOME) {
            position.setPosition(0, 0);
        } else if (key === e.ENTER) {
            me.rowSelect(position.record);
        } else if (key === e.END) {
            position.setPosition(me.getStore().getData().length - 1, 0);
        } else if (key === e.PAGE_UP) {
            if (me.getStore().currentPage > 1) {
                me.getStore().previousPage();
            }
        } else if (key === e.PAGE_DOWN) {
            if (me.getStore().currentPage < Math.ceil(me.getStore().getTotalCount() / me.getStore().getPageSize())) {
                me.getStore().nextPage();
            }
        } else {
            return me.callParent(arguments);
        }

        if (Ext.isEmpty(position) || Ext.isEmpty(position.column)) {
            return
        }
        navigationModel.setPosition(position);
        me.getPicker().getSelectionModel().selectByPosition(navigationModel.getPosition());
    },

    onExpand: function () {
        var me = this;
        me.callParent(arguments);
        me.focus();
    },

    createPicker: function () {
        var me = this;

        var picker = Ext.create('Ext.grid.Panel', Ext.apply({
            store: me.store,
            floating: true,
            focusOnToFront: false,
            viewConfig: {
                focusOwner: me
            },
            selModel: {
                selType: 'rowmodel',
                mode: me.multiSelect ? 'SIMPLE' : 'SINGLE'
            },
            dockedItems: [me.store.pageSize == 0 ? null : {
                xtype: 'pagingtoolbar',
                itemId: 'pagingtoolbar',
                store: me.store,
                dock: 'bottom',
                displayInfo: true
            }],
            listeners: {
                rowclick: function (grid, record) {
                    me.rowSelect(record);
                },
                rowkeydown: function (grid, record, tr, rowIndex, e) {
                    if (e.getKey() === e.ENTER) {
                        me.rowSelect(record);
                    }
                }
            }
        }, me.grid));

        me.picker = picker;
        return picker;
    },

    /**
     * @private
     * If the autoSelect config is true, and the picker is open, highlights the first item.
     */
    doAutoSelect: function () {
        var me = this;
        me.callParent(arguments);
        me.getPicker().getSelectionModel().selectByPosition(me.getPicker().getNavigationModel().getPosition());
    },

    /**
     * 表格数据选择
     * @param record
     */
    rowSelect: function (record) {
        var me = this;
        me.select(record, true);
        me.collapse();
        me.validate();
        me.fireEvent('select', me, record);// 发出选中事件
    }
});