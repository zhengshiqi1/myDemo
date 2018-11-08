/**
 * 为设置了必填的表单字段，添加<span style="color: red">*</span>。
 */
Ext.define('overrides.form.field.Base', {
    override: 'Ext.form.field.Base',

    initComponent: function () {
        if (!this.fieldCaption)
            this.fieldCaption = this.fieldLabel;
        if (this.allowBlank !== undefined && !this.allowBlank) {
            if (this.fieldLabel && this.fieldLabel.indexOf('<span style="color: red">*</span>') < 0) {
                this.fieldLabel = '<span style="color: red"> * </span>' + this.fieldLabel;
            }
        }
        this.callParent(arguments);
    },

    getFieldCaption: function () {
        return this.fieldCaption;
    },

    setFieldCaption: function (fieldCaption) {
        var me = this,
            fieldLabel = fieldCaption;

        if (me.allowBlank !== undefined && !me.allowBlank) {
            fieldLabel = '<span style="color: red"> * </span>' + fieldCaption;
        }
        me.setFieldLabel(fieldLabel);
    }
});