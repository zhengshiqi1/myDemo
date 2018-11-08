/**
 * Created by cRazy on 2016/10/21.
 */
Ext.define('overrides.form.CheckboxGroup', {
    override: 'Ext.form.CheckboxGroup',

    initComponent: function () {
        var me = this;
        me.initUnitary();
        me.callParent(arguments);
    },

    /**
     * @cfg {String} unitary
     * 可设置为某一name值，设置后可根据该name获取或设置
     */

    initUnitary: function () {
        var me = this;
        if (!me.unitary)
            return;

        Ext.Array.each(me.items, function (items) {
            items.name = me.unitary;
        });

        var capitalizedName = me.unitary.charAt(0).toUpperCase() + me.unitary.substr(1);
        me['get' + capitalizedName] = function () {
            var value = me.getValue();
            return value[me.unitary];
        };

        me['set' + capitalizedName] = function (value) {
            if (Ext.encode(me['get' + capitalizedName]()) == Ext.encode(value)) {
                return;
            }
            var obj = {};
            obj[me.unitary] = value;
            me.setValue(obj);
        }
    },


    /**
     * Publish the value of this field.
     *
     * @private
     */
    publishValue: function () {
        var me = this,
            value = me.getValue();

        if (me.rendered && !me.getErrors().length) {
            me.publishState('value', value);
            if (me.unitary && value) {
                me.publishState(me.unitary, value[me.unitary]);
            }
        }
    }
});