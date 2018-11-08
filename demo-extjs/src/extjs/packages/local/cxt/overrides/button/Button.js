/**
 * Created by cRazy on 2016/11/4.
 */
Ext.define('overrides.button.Button', {
    override: 'Ext.button.Button',

    config: {

        /**
         * 当revoke = true时，不触发点击事件。
         * 按钮连续点击后，可能多次触发click实际当遇到该场景时，可以设置revoke = true。
         */
        revoke: false
    },

    /**
     * @private
     */
    onClick: function (e) {
        var me = this;
        me.doPreventDefault(e);

        // Can be triggered by ENTER or SPACE keydown events which set the button property.
        // Only veto event handling if it's a mouse event with an alternative button.
        // Checking e.button for a truthy value (instead of != 0) also allows touch events
        // (tap) to continue, as they do not have a button property defined.
        if (e.type !== 'keydown' && e.button) {
            return;
        }
        if (!(me.disabled || me.revoke === true)) {
            me.doToggle();
            me.maybeShowMenu(e);
            me.fireHandler(e);
        }
    },

    doPreventDefault: function (e) {
        if (e && (this.preventDefault || (this.disabled && this.getHref())) || this.revoke === true) {
            e.preventDefault();
        }
    }
});