/**
 * Created by cRazy on 2016/7/3.
 */
Ext.define('Cxt.form.field.BizStateLabel', {
    extend: 'Ext.form.Label',
    alias: 'widget.bizstatelabel',

    requires: [
        'Cxt.util.Format'
    ],

    /**
     * @cfg {String} value
     * bizState
     */

    /**
     * @cfg {String} styleMapping
     * 默认默认的bizState样式
     * # Example styleMapping
     *      @example
     *      styleMapping:{
     *           ineffect: 'cre-state-unavailable'
     *      }
     */
    styleMapping: {
        ineffect: 'cre-state-unavailable',
        submit: 'cre-state-unavailable',
        reject: 'cre-state-danger',
        effect: 'cre-state-available',
        aborted: 'cre-state-danger'
    },

    
    typeMapping:{
        yi:'cre-state-unavailable',
        shi:'cre-state-unavailable',
        zhu:'cre-state-danger',
        xing:'cre-state-available'
    },

    /**
     * @cfg {String} captionMapping
     * 默认使用BizStates中的标题设置。可以增加额外的设置。例如：
     * # Example captionMapping
     *      @example
     *      captionMapping:{
     *          approved:'已审核'
     *      }
     */
    captionMapping: {},

    getValue: function () {
        return this.value;
    },

    setValue: function (value) {
        var me = this,
            caption;
        me.value = value;

        if (me.captionMapping.hasOwnProperty(value)) {
            caption = me.captionMapping[value];
        } else {
            caption = Cxt.util.Format.bizState(value);
        }

        if (!Ext.isEmpty(me.stateCls)) {
            me.removeCls(me.stateCls);
        }
        if (me.styleMapping.hasOwnProperty(value)) {
            me.stateCls = me.styleMapping[value];
            me.addCls(me.stateCls);
        }
        me.setText(caption);
    }
});