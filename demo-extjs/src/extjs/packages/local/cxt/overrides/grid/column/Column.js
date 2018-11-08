/**
 * Created by cRazy on 2016/9/21.
 */
Ext.define('overrides.grid.column.Column', {
    override: 'Ext.grid.column.Column',

    config: {

        /**
         * @cfg {boolean} allowBlank
         * 是否允许为空，表格验证时使用
         */
        allowBlank: true
    },
    // 默认隐藏
    menuDisabled: true,

    menuDisabledCls: Ext.baseCSSPrefix + 'column-header-menuDisabled',

    setAllowBlank: function (allowBlank) {
        var me = this;
        me.allowBlank = allowBlank;
        if (me.rendered && me.allowBlank) {
            me.textEl.setHtml(me.text);
        } else if (me.rendered) {
            me.textEl.setHtml('<span style="color: red"> * </span>' + me.text);
        }
    },

    /**
     * Sets the header text for this Column.
     * @param {String} text The header to display on this Column.
     */
    setText: function (text) {
        var me = this;
        me.text = text;
        if (me.rendered && me.allowBlank) {
            me.textEl.setHtml(text);
        } else if (me.rendered) {
            me.textEl.setHtml('<span style="color: red"> * </span>' + text);
        }
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);

        if (!me.allowBlank) {
            me.textEl.setHtml('<span style="color: red"> * </span>' + me.text);
        }
        if (me.menuDisabled && !me.hasCls(me.menuDisabledCls)) {
            me.addCls(me.menuDisabledCls);
        }
    },

    getContextValue: function (value, column, record) {
        return value;
    }

});