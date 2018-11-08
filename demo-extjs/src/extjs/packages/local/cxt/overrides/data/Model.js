/**
 * Created by cRazy on 2016/10/13.
 */
Ext.define('overrides.data.Model', {
    override: 'Ext.data.Model',

    /**
     * 如果data是String，则返回data。
     */
    getData: function (options) {
        var me = this;

        if (Ext.isString(me.data)) {
            return me.data;
        }
        return me.callParent(arguments);
    }

});