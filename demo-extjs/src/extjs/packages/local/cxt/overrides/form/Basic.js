/**
 * 允许提交中断
 * Created by cRazy on 2016-8-9-0009.
 */
Ext.define('overrides.form.Basic', {
    override: 'Ext.form.Basic',

    /**
     * @private
     * Called before an action is performed via {@link #doAction}.
     * @param {Ext.form.action.Action} action The Action instance that was invoked
     */
    beforeAction: function (action) {
        var me = this,
            waitMsg = action.waitMsg,
            maskCls = Ext.baseCSSPrefix + 'mask-loading',
            fields = me.getFields().items,
            f,
            fLen = fields.length,
            field, waitMsgTarget;

        // Call HtmlEditor's syncValue before actions
        for (f = 0; f < fLen; f++) {
            field = fields[f];

            if (field.isFormField && field.syncValue) {
                field.syncValue();
            }
        }

        if (waitMsg) {
            waitMsgTarget = me.waitMsgTarget;
            if (waitMsgTarget === true) {
                me.owner.el.mask(waitMsg, maskCls);
            } else if (waitMsgTarget) {
                waitMsgTarget = me.waitMsgTarget = Ext.get(waitMsgTarget);
                waitMsgTarget.mask(waitMsg, maskCls);
            } else {
                me.floatingAncestor = me.owner.up('[floating]');

                // https://sencha.jira.com/browse/EXTJSIV-6397
                // When the "wait" MessageBox is hidden, the ZIndexManager activates the previous
                // topmost floating item which would be any Window housing this form.
                // That kicks off a delayed focus call on that Window.
                // So if any form post submit processing displayed a MessageBox, that gets
                // stomped on.
                // The solution is to not move focus at all during this process.
                if (me.floatingAncestor) {
                    me.savePreventFocusOnActivate = me.floatingAncestor.preventFocusOnActivate;
                    me.floatingAncestor.preventFocusOnActivate = true;
                }

                var message = {
                    title: action.waitTitle || me.waitTitle,
                    message: waitMsg,
                    closable: false,
                    wait: true,
                    modal: true,
                    buttons: Ext.Msg.CANCEL,
                    fn: function () {
                        action.cancel = true;
                    }
                };
                Ext.MessageBox.wait(message);
            }
        }
    },


    /**
     * @private
     * Called after an action is performed via {@link #doAction}.
     * @param {Ext.form.action.Action} action The Action instance that was invoked
     * @param {Boolean} success True if the action completed successfully, false, otherwise.
     */
    afterAction: function (action, success) {
        var me = this;
        if (action.cancel) {
            return;
        }
        
        me.callParent(arguments);


    }
});