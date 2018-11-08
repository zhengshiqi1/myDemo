/**
 * 为Container 提供额外的方法。
 * clearValue：清除容器中所有控件的取值
 * isValid：判断容器中所有控件的验证情况
 * getErrors：取的容器中所有控件的错误消息
 * clearInvalid：清除容器中所有控件的验证信息。
 * focusOnFirst：将光标定位在容器重的第一个可聚焦的控件上。
 *
 * Created by cRazy on 2016-8-9-0009.
 */
Ext.define('overrides.container.Container', {
    override: 'Ext.container.Container',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.CheckboxGroup',
        'Ext.form.field.Base',
        'Ext.grid.CellContext',
        'Ext.grid.Panel'
    ],

    /**
     * @cfg {boolean} enterTab
     * 表单回车处理
     */
    enterTab: true,

    /**
     * @cfg {boolean} errorPrefixing
     * 错误消息是否加前缀。
     */
    errorPrefixing: false,

    onAdd: function (component, position) {
        var me = this;
        me.callParent(arguments);

        if (component instanceof Ext.form.field.Base && me.enterTab) {
            component.on('specialkey', me.onKeydownX, me);
        }
    },

    /**
     * 清除容器中所有控件的取值。
     */
    clearValue: function () {
        var me = this;
        if (Ext.isEmpty(me.items))
            return;

        Ext.Array.each(me.items.items, function (item) {
            if (Ext.isFunction(item.setValue)) {
                item.setValue();
                if (Ext.isFunction(item.setRawValue))
                    item.setRawValue();
                return;
            }
            if (item instanceof Ext.grid.Panel) {// 表格特殊处理
                item.getStore().loadData([]);
            } else if (item instanceof Ext.container.Container) {
                item.clearValue(item)
            }
        });
    },


    /**
     * 验证容器中的所有字段正确性
     * @return {Boolean} True if it is valid, else false
     */
    isValid: function () {
        var me = this,
            errors = me.getErrors();
        return Ext.isEmpty(errors);
    },

    /**
     * 验证容器中的所有字段正确性
     * @return {String[]} Array of any validation errors
     */
    getErrors: function () {
        var me = this,
            errors = [];

        Ext.Array.each(me.items.items, function (item) {
            if (!item.isVisible()) {
                return;
            }
            if (Ext.isFunction(item.isValid)) {// 有isValid方法的，先调用，正确则返回
                if (item.isValid()) {
                    return;
                }
            }


            var list = [];

            if (item instanceof Ext.grid.Panel) {// 表格特殊处理
                list = item.getErrors();
            } else if (item instanceof Ext.form.field.Base) {
                Ext.Array.each(item.getErrors(), function (error) {
                    var message = {
                        text: error,
                        source: item
                    };
                    if (!Ext.isEmpty(item.fieldCaption)) {
                        message.text = item.fieldCaption + "：" + error;
                    }
                    errors.push(message);
                });
            } else if (item instanceof Ext.form.CheckboxGroup) {
                Ext.Array.each(item.getErrors(), function (error) {
                    var message = {
                        text: error,
                        source: item
                    };
                    if (!Ext.isEmpty(item.fieldCaption)) {
                        message.text = item.fieldCaption + "：" + error;
                    }
                    errors.push(message);
                });
            } else if (Ext.isFunction(item.getErrors)) {// 提供了getErrors方法的直接取。
                list = item.getErrors();
            } else if (item instanceof Ext.container.Container) {
                list = item.getErrors();
            }

            Ext.Array.each(list, function (message) {
                if (me.errorPrefixing && item.title) {
                    message.text = item.title + '/' + message.text
                }
                errors.push(message);
            });
        });
        return errors;
    },

    /**
     * Clear any invalid styles/messages for this container.
     */
    clearInvalid: function () {
        var me = this;
        if (Ext.isEmpty(me.items))
            return;

        Ext.Array.each(me.items.items, function (item) {
            if (Ext.isFunction(item.clearInvalid)) {
                item.clearInvalid();
            }
        });
    },

    /**
     * 定位在容器中的第一个可聚焦的控件上
     */
    focusOnFirst: function () {
        var me = this;
        return me.focusOnNext();
    },


    focusOnNext: function (field, event) {
        var me = this,
            index = -1;

        if (field) {
            index = me.items.findIndex('id', field.getId());
        }
        for (var i = index + 1; i < me.items.getCount(); i++) {
            var item = me.items.getAt(i);
            if (Ext.isEmpty(item.getItemId()) || item instanceof Ext.button.Button)
                continue;

            if (item instanceof Ext.grid.Panel) {    // 表格的处理
                var position = new Ext.grid.CellContext(item.getView());
                position.setPosition(0, 0);
                while (item.editingPlugin && item.getStore().getData().length > 0) {
                    position = item.getView().walkCells(position, 'right');
                    if (Ext.isEmpty(position) || Ext.isEmpty(position.column) || position.column.getEditor()) {
                        item.getNavigationModel().setPosition(position, null, event);
                        if (item.editingPlugin && !item.editingPlugin.startEditByPosition(position) === false) {
                            return true;
                        }
                    }
                }
            } else if (item.focusable && item.canFocus() && item.readOnly != true) {
                if (item.getFocusEl()) {
                    item.focus();
                    if (Ext.isFunction(item.selectText)) {
                        item.selectText();
                    }
                    return true;
                }
            } else if (item instanceof Ext.container.Container) {
                if (item.focusOnNext())
                    return true;
            }
        }

        var up = me.up();
        if (!!up && up instanceof Ext.container.Container) {
            return up.focusOnNext(me);
        }
    },

    focusOnPrev: function (field, event) {
        var me = this,
            index = me.items.getCount();

        if (field) {
            index = me.items.findIndex('id', field.getId());
        }
        for (var i = index - 1; i >= 0; i--) {
            var item = me.items.getAt(i);
            if (Ext.isEmpty(item.getItemId()) || item instanceof Ext.button.Button)
                continue;

            if (item instanceof Ext.grid.Panel) {    // 表格的处理
                var position = new Ext.grid.CellContext(item.getView());
                position.setPosition(0, 0);
                while (item.getStore().getData().length > 0) {
                    position = item.getView().walkCells(position, 'left');
                    if (Ext.isEmpty(position) || Ext.isEmpty(position.column) || position.column.getEditor()) {
                        item.getNavigationModel().setPosition(position, null, event);
                        if (item.editingPlugin && !item.editingPlugin.startEditByPosition(position) === false) {
                            return true;
                        }
                    }
                }
            } else if (item.focusable && item.canFocus() && item.readOnly != true) {
                if (item.getFocusEl()) {
                    item.focus();
                    if (Ext.isFunction(item.selectText)) {
                        item.selectText();
                    }
                    return true;
                }
            } else if (item instanceof Ext.container.Container) {
                if (item.focusOnNext())
                    return true;
            }
        }

        var up = me.up();
        if (!!up && up instanceof Ext.container.Container) {
            return up.focusOnNext(me);
        }
    },

    //按键事件
    /**
     * @private
     * @param field
     * @param e
     * @returns {boolean}
     */
    onKeydownX: function (field, e) {
        var me = this,
            shift = e.shiftKey;
        if (e.getKey() == e.ENTER || e.getKey() == e.TAB) {
            e.stopEvent();

            if (shift) {
                me.focusOnPrev(field, e);
            } else {
                me.focusOnNext(field, e);
            }
            return false;
        }
    }
});