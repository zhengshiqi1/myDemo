/**
 * Created by cRazy on 2016/6/27.
 */
Ext.define('Cxt.titlebar.ModuleTitleBar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'moduletitlebar',

    requires: [
        'Ext.form.Label',
        'Ext.toolbar.Toolbar'
    ],

    /**
     * @cfg {Object[]} leftItems
     * 左侧按钮列，不应该超过宽度的35%，否则会影响标题的显示。
     */

    /**
     * @cfg {String} titleItems
     * 中间的标题控件，也可以直接设置title来构建一个html。
     */

    /**
     * @cfg {Object[]} title
     * 标题，当@link titleItems 为空时会自动构造
     */

    /**
     * @cfg {Object[]} rightItems
     * 右侧按钮列，不应该超过宽度的35%，否则会影响标题的显示。
     */

    height: 45,
    width: '100%',
    style: 'background-color: white',
    defaults: {
        scale: 'medium'
    },

    initComponent: function () {
        var me = this,
            leftItems = me.createLeftItems(),
            titleItems = me.createTitleItems(),
            rightItems = me.createRightItems();
        Ext.apply(me, {
            items: Ext.Array.merge(leftItems, '->', titleItems, '->', rightItems)
        });
        me.callParent(arguments);
    },

    createLeftItems: function () {
        var me = this;
        return me.leftItems;
    },

    createTitleItems: function () {
        var me = this;

        if (Ext.isEmpty(me.titleItems)) {
            return [{
                xtype: 'label',
                cls: 'topTitle',
                text: me.title
            }];
        }
        return me.titleItems;
    },

    createRightItems: function () {
        var me = this;
        return me.rightItems;
    }
});