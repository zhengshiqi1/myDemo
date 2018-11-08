/**
 * LoadMark遮罩优化处理，主要为避免多次实例化LoadMark造成内存浪费
 * Created by cRazy on 2016/7/18.
 */
Ext.define('Cxt.util.LoadMark', function () {
    var me; // holds our singleton instance

    var mark;

    return {
        singleton: true,
        loadingText: '正在加载...',

        constructor: function () {
            me = this; // we are a singleton, so cache our this pointer in scope
        },

        initMark: function (target) {
            if (!!mark)
                return;

            if (Ext.isEmpty(target)) {
                Ext.raise("You must specify a target config.");
            }
            mark = new Ext.LoadMask({
                msg: me.loadingText,
                target: target
            });
        },

        /**
         * 显示对话框
         *
         * @param {String} html
         *          显示的文字，可以包含HTML标记，默认为{@link #loadingText}
         * upon Component resize, and the message box will be kept centered.
         */
        show: function (html) {
            if (html) {
                mark.msg = html;
            } else {
                mark.msg = me.loadingText;
            }
            mark.show();
        },

        hide: function () {
            mark.hide();
        }
    }
});