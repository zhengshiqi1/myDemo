/**
 * Created by cRazy on 2016/10/14.
 */
Ext.define('overrides.menu.Item', {
    override: 'Ext.menu.Item',

    show: function () {
        var me = this,
            owner = me.up();
        me.callParent(arguments);

        if (owner && Ext.isFunction(owner.minimizeSeparators)) {
            owner.minimizeSeparators();
        }
    },

    hide: function () {
        var me = this,
            owner = me.up();
        me.callParent(arguments);

        if (owner && Ext.isFunction(owner.minimizeSeparators)) {
            owner.minimizeSeparators();
        }
    }
});