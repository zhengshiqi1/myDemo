/**
 * Created by cRazy on 2016/9/23.
 */
Ext.define('overrides.grid.CellEditor', {
    override: 'Ext.grid.CellEditor',

    requires: [
        'Ext.container.Container',
        'Ext.form.field.Picker'
    ],


    /**
     * @inherited
     * @param remainVisible
     */
    completeEdit: function (remainVisible) {
        var me = this,
            field = me.field;

        if (!field || field.isDestroyed) {
            return;
        }

        me.callParent(arguments);
        if (Ext.isFunction(field.clearInvalid)) {// 清除掉错误的验证消息。
            field.clearInvalid();
        }
        if (Ext.isFunction(field.clearValue)) {// 清除控件的值，为下次设置准备
            field.clearValue();
        }
    },
    /**
     * @inherited
     * @param e
     */
    onFocusLeave: function (e) {
        var me = this,
            field = me.field;

        if (!field || field.isDestroyed || !field.el.dom) {
            return;
        }

        if (me.allowBlur === true && me.editing) {
            me.completeEdit();
        }
        me.callParent([e]);
    },

    onSpecialKey: function (field, event) {
        var me = this,
            key = event.getKey();
        switch (key) {
            case event.TAB:
                me.onKeyTab(field, event);
                break;
            case event.ENTER:
                me.onKeyEnter(field, event);
                break;
            case event.RIGHT:
            case event.LEFT:
                me.onKeyLeftRight(field, event);
                break;
            case event.UP:
            case event.DOWN:
                me.onKeyUpDown(field, event);
                break;
            default:
                me.callParent(arguments);
        }
    },

    onKeyTab: function (field, event) {
        var me = this,
            up = me.grid.up();
        event.stopEvent();
        if (!!up && up instanceof Ext.container.Container) {
            return up.focusOnNext(me.grid);
        }
    },

    onKeyEnter: function (field, event) {
        var me = this,
            view = me.context.view,
            navigationModel = view.getNavigationModel(),
            grid = view.ownerGrid,
            newPosition, lastPosition;

        me.completeEdit(true);

        if (me.context.isValid === false)
            return;

        navigationModel.setPosition(me.context, null, event);
        grid.setActionableMode(false);
        newPosition = navigationModel.getPosition();

        while (true) {
            while (true) {
                lastPosition = newPosition;
                newPosition = view.walkCells(lastPosition, 'right');
                if (Ext.isEmpty(newPosition) || Ext.isEmpty(newPosition.column) || newPosition.column.getEditor()) {
                    break;
                }
            }

            // 本行右侧没有enterStop的可编辑单元. 加一行数据后找第一个enterStop的可编辑单元格
            if (!newPosition) {
                if (grid.autoAppend === false) {
                    return;
                }
                grid.getStore().getProxy().getData().push({});
                grid.getStore().load();

                newPosition = lastPosition;
                newPosition.setPosition(lastPosition.rowIdx + 1, 0);
                while (true) {
                    lastPosition = newPosition;
                    newPosition = view.walkCells(lastPosition, 'right');
                    if (Ext.isEmpty(newPosition) || Ext.isEmpty(newPosition.column) || newPosition.column.getEditor()) {
                        break;
                    }
                }
            }

            navigationModel.setPosition(newPosition, null, event);
            if (!me.editingPlugin.startEditByPosition(newPosition) === false) {
                break;
            }
        }
    },

    onKeyLeftRight: function (field, event) {
        var me = this,
            dir = event.getKey() === event.RIGHT ? 'right' : 'left',
            view = me.context.view,
            navigationModel = view.getNavigationModel(),
            grid = view.ownerGrid,
            newPosition;

        if (!me.isCaretOutOfBound(event.target, dir)) {
            return;
        }

        me.completeEdit(true);
        navigationModel.setPosition(me.context, null, event);
        grid.setActionableMode(false);

        newPosition = view.walkCells(navigationModel.getPosition(), dir);
        if (me.context.rowIdx !== newPosition.rowIdx) {
            return;
        }
        navigationModel.setPosition(newPosition, null, event);
        if (newPosition.column.getEditor()) {
            me.editingPlugin.startEditByPosition(newPosition);
        }
    },
    // datefield下键会弹出pickup
    onKeyUpDown: function (field, event) {
        var me = this,
            dir = event.getKey() === event.UP ? 'up' : 'down',
            view = me.context.view,
            navigationModel = view.getNavigationModel(),
            grid = view.ownerGrid,
            newPosition;

        if (event.getKey() === event.DOWN && field instanceof Ext.form.field.Picker) {
            field.expand();
            return;
        }

        me.completeEdit(true);
        navigationModel.setPosition(me.context, null, event);
        grid.setActionableMode(false);

        newPosition = view.walkCells(navigationModel.getPosition(), dir);
        if (!newPosition) {
            if (grid.autoAppend === false || dir == 'up') {
                return;
            }

            grid.getStore().getProxy().getData().push({});
            grid.getStore().load();
            newPosition = view.walkCells(navigationModel.getPosition(), dir);
        }
        navigationModel.setPosition(newPosition, null, event);
        if (newPosition.column.getEditor()) {
            me.editingPlugin.startEditByPosition(newPosition);
        }
    },

    isCaretOutOfBound: function (el, dir) {
        if (el.type === 'button' || el.type === 'checkbox' || el.readOnly) return true;

        var caretPos;
        if (document.selection) { // IE
            var range = document.selection.createRange();
            range.moveStart("character", -el.value.length);
            caretPos = range.text.length;
        } else { // !IE
            caretPos = el.selectionStart;
        }
        return dir === 'right' ? (el.value.length === caretPos) : (0 === caretPos);
    }
});