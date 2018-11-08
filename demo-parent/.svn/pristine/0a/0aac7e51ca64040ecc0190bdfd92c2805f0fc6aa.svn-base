/**
 * 增加工具栏分隔符精简方法
 * Created by cRazy on 2016-8-9-0009.
 */
Ext.define('overrides.toolbar.Toolbar', {
    override: 'Ext.toolbar.Toolbar',

    requires: [
        'Ext.toolbar.Separator'
    ],

    /**
         * 精简多余的分隔条，多余的分隔条会被隐藏，若发现之前被精简分隔条的现在已不需要精简，则重新显示之。
     */
    minimizeSeparators: function () {
        var me = this,
            prevItem, last;

        me.items.each(function (item) {
            if (item.xtype instanceof Ext.toolbar.Separator) {
                var visible = prevItem != null && !(prevItem instanceof Ext.toolbar.Separator);
                item.setHidden(!visible);
                if (visible) {
                    prevItem = item;
                }
            }
            if (item.isVisible()) {
                last = item;
            }
        });

        // 隐藏尾部多余的分隔条
        if (last && last instanceof Ext.toolbar.Separator)
            last.setHidden(true);
    }
});