/**
 * Created by cRazy on 2016/9/30.
 */
Ext.define('overrides.form.field.Text', {
    override: 'Ext.form.field.Text',

    /**
     * @cfg {String} suffix
     * 后缀
     */

    /**
     * @cfg {String} suffixWidth
     * 后缀宽度
     */
    suffixWidth: 45,

    initComponent: function () {
        var me = this;

        if (!Ext.isEmpty(me.suffix)) {
            if (!me.suffixWidth) {
                Ext.raise("You must specify a suffixWidth config.");
            }
            me.postSubTpl = [
                '</div>', // end inputWrap
                '<div class="x-form-text-wrap" style="vertical-align: middle;width:' + me.suffixWidth + 'px;padding:0 3px;text-align:right"> ',
                me.suffix,
                '</div>',
                '<tpl for="triggers">{[values.renderTrigger(parent)]}</tpl>',
                '</div>' // end triggerWrap
            ];
        }

        me.callParent(arguments);
    },

    isAllowBlank: function () {
        return this.allowBlank;
    },

    /**
     *  设置是否必填
     */
    setAllowBlank: function (allowBlank) {
        var me = this,
            fieldLabel = me.fieldCaption;
        me.allowBlank = allowBlank;

        if (me.rendered && fieldLabel) {
            if (allowBlank == false && fieldLabel.indexOf('<span style="color: red">*</span>') < 0) {
                me.setFieldLabel('<span style="color: red"> * </span>' + fieldLabel);
            } else {
                me.setFieldLabel(fieldLabel);
            }
        }
    }
});