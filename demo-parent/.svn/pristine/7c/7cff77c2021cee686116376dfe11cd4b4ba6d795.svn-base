/**
 * Created by cRazy on 2016/9/26.
 */
Ext.define('overrides.window.Toast', {
    override: 'Ext.window.Toast',

    requires: [
        'Ext.window.Toast'
    ],


    hide: function (animate) {
        var me = this,
            el = me.el;

        if (el && animate === false) {
            me.cancelAutoClose();
            Ext.window.Toast.superclass.hide.call(this, me.animateTarget, me.doClose, me);
            me.removeFromAnchor();
            me.isHiding = false;
        } else {
            me.callParent(arguments);
        }

        return me;
    }

});