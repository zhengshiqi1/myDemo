/**
 * Created by cRazy on 2016/10/12.
 */
Ext.define('overrides.panel.Panel', {
    override: 'Ext.panel.Table',

    initComponent: function () {
        var me = this;
        if (me.dockedItems) {
            Ext.Array.sort(me.dockedItems, function (a, b) {
                if (!a.sequence)
                    return 1;
                if (!b.sequence)
                    return -1;
                if (a.sequence < b.sequence)
                    return -1;
                return 1;
            });
        }

        me.callParent(arguments);
    }
});