/**
 * Created by cRazy on 2016/7/9.
 */
Ext.define('Cxt.panel.MessagePanel', {
    extend: 'Ext.panel.Panel',
    xtype: 'messagepanel',

    requires: [
        'Ext.button.Button',
        'Ext.form.Label',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'Ext.tab.Panel'
    ],

    width: '100%',
    layout: 'hbox',

    ui: 'message',
    border: true,
    closable: true,

    /**
     * @cfg {Object[]} messages
     *  错误消息
     *     @example
     *     messages: [{
     *         itemId: 'button-1001',
     *         text: 项目不能为空,
     *     }];
     */
    messages: undefined,

    /**
     * @cfg {String} [fieldCls="x-label-link"]
     * link的样式
     */
    linkCls: Ext.baseCSSPrefix + 'label-link',

    initComponent: function () {
        var me = this,
            closable = me.closable;

        Ext.apply(me, {
            closable: false,
            items: [{
                xtype: 'button',
                ui: 'hint',
                html: '<span class="fa fa-exclamation-circle" style="text-align:right;width:20px;color: #F16152;font-size:18px;"></span>'
            }, {
                xtype: 'panel',
                itemId: 'listPanel',
                ui: 'message',
                layout: 'vbox',
                flex: 1,
                padding: '5 0 5 0'
            }, {
                xtype: 'button',
                itemId: 'closeBtn',
                ui: 'hint',
                width: 40,
                // alignTarget: me,
                // defaultAlign: 't-t',
                // floating: true,
                // shadow: false,
                // hidden: !closable,
                // autoShow: true,
                // style:{
                //
                // }
                html: '<span style="font-size: 20px">×</span>',
                handler: function () {
                    me.hide();
                }
            }]
        });

        me.callParent(arguments);
        me.setMessages(me.messages);
    },

    /**
     * 设置消息列表
     * @param {Object[]} messages
     */
    setMessages: function (messages) {
        var me = this;
        me.messages = messages;
        me.refreshMessages();
    },

    /**
     * Remove all messages
     */
    clearMessages: function () {
        var me = this;
        delete me.messages;
        me.refreshMessages();
    },

    setRoot: function (root) {
        this.root = root;
    },

    refreshMessages: function () {
        var me = this,
            listPanel = me.down('#listPanel'),
            items = [];
        listPanel.removeAll();

        if (Ext.isEmpty(me.messages)) {
            me.hide();
            return;
        }
        Ext.Array.each(me.messages, function (message) {
            items.push({
                xtype: 'label',
                html: message.text,
                cls: me.linkCls,
                margin: '2 0 2 0',
                listeners: {
                    click: {
                        element: 'el',
                        fn: function () {
                            me.onMessageSelect(message);
                        }
                    }
                }
            });
        });

        listPanel.add(items);

        me.show();
    },

    onMessageSelect: function (message) {
        var me = this;

        if (!message.source)
            return;
        me.sourceTrace(message.source);

        Ext.defer(function () {
            if (Ext.isFunction(message.source.focus)) {
                message.source.focus();
            }
            me.fireEvent('select', me, message);
        }, 200);
    },

    sourceTrace: function (item) {
        if (!item || item instanceof Ext.Component == false)
            return;

        var me = this,
            up = item.up();

        if (up instanceof Ext.tab.Panel) {
            up.setActiveItem(item.getItemId());
        }
        me.sourceTrace(up);
    }
});