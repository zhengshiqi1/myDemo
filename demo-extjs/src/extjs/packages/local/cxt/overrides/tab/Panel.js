/**
 * Created by cRazy on 2016/9/7.
 */
Ext.define('overrides.tab.Panel', {
    override: 'Ext.tab.Panel',

    requires: [
        'Ext.form.CheckboxGroup',
        'Ext.form.field.Base',
        'Ext.grid.Panel'
    ],

    errorPrefixing: true,

    afterRender: function (layout) {
        var me = this;
        me.callParent(arguments);

        if (me.deferredRender === false) {
            me.items.each(function (item) {
                Ext.defer(function () {
                    me.setActiveItem(item);
                }, 50);
            });
            Ext.defer(function () {
                me.setActiveItem(0);
            }, 50);
        }
    },

    /**
     * 验证容器中的所有字段正确性
     * @return {String[]} Array of any validation errors
     */
    getErrors: function () {
        var me = this,
            errors = [];
        if (me.deferredRender) {
            // 延时渲染则仅返回当前面板的验证内容
            var item = me.getActiveTab();
            if (item instanceof Ext.grid.Panel) {// 表格特殊处理
                errors = item.getErrors();
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
                errors = item.getErrors();
            }
        } else {
            Ext.Array.each(me.items.items, function (item) {
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
                        list.push(message);
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
                        list.push(message);
                    });
                } else if (Ext.isFunction(item.getErrors)) {// 提供了getErrors方法的直接取。
                    list = item.getErrors();
                }

                Ext.Array.each(list, function (message) {
                    if (me.errorPrefixing && item.title) {
                        message.text = item.title + '/' + message.text
                    }
                    errors.push(message);
                });
            });
        }
        return errors;
    }
});