/**
 * 作为模块基类的选择，提供了标准模块具有的标题栏与工具栏
 *     @example
 *     operations: [{
 *             controller: 'controller',
 *             titlebar: { // 标题栏
 *                  xtype: 'typicalmoduletitlebar',
 *                  title: '新建销售数据录入单',
 *                  router: 'sales.salesinput',
 *                  searchXtype: 'sales.salesinput.combo'
 *              },
 *             tools: [{}.{}] // 工具栏，数组
 *             items: // 主面板控件。也可以使用 createMainItems 来处理
 *        }],
 * Created by cRazy on 2016/6/17.
 */
Ext.define('Cpnt.frame.BaseContentPanel', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Cxt.panel.MessagePanel',
        'Cxt.titlebar.ModuleTitleBar',
        'Ext.button.Button',
        'Ext.layout.container.VBox'
    ],

    ui: 'frame',
    layout: 'vbox',
    width: "100%",
    flex: 1,
    scrollable: {
        x: false,
        y: true
    },

    /**
     * @cfg {Object} titlebar
     * 标题栏，提供moduletitlebar
     */

    /**
     * @cfg {Object} toolbar
     * 工具栏。可直接设置items。也可以对其他内容进行设置。
     */

    /**
     * @cfg {Object} copyrightPanel
     * 授权的面板，暂时没用到
     */

    /**
     *  initComponent
     */
    initComponent: function () {
        var me = this;
        if (!me.getViewModel()) {
            Ext.raise("You must specify a viewModel config.");
        }

        Ext.apply(me, me.setupConfig());
        me.callParent(arguments);
    },

    setupConfig: function () {
        var me = this,
            dockedItems = Ext.Array.from(me.dockedItems),
            leftMargin = 20, rightMargin = 20;

        dockedItems.push(me._createTitleBar());
        dockedItems.push(me._createToolbar());
        dockedItems.push(me._createMessagePanel());

        Ext.Array.each(me.dockedItems, function (item) {
            if (item.dock == 'left') {
                leftMargin = 10;
                item.margin = '0 0 0 20';
            } else if (item.dock == 'right') {
                rightMargin = 10;
                item.margin = '0 20 0 0';
            }
        });
        Ext.Array.each(me.items, function (item) {
            Ext.applyIf(item, {
                cls: 'shadow',
                margin: '0 ' + rightMargin + ' 10 ' + leftMargin
            });
        });
        return {
            dockedItems: dockedItems
        };
    },

    /** 创建标题栏*/
    _createTitleBar: function () {
        var me = this,
            titlebar = {
                xtype: 'moduletitlebar',
                cls: 'shadow',
                dock: 'top',
                width: '100%',
                title: me.module.moduleCaption// 如果未设置标题，则使用模块标题
            };

        Ext.apply(titlebar, me.titlebar);
        return titlebar;
    },

    /** 创建工具栏*/
    _createToolbar: function () {
        var me = this,
            toolbar = {
                xtype: 'toolbar',
                ui: 'frame',
                dock: 'top',
                width: '100%',
                margin: '5 20 6 10',
                defaults: {
                    margin: 3,
                    scale: 'medium'
                }
            };

        Ext.apply(toolbar, me.toolbar);

        if (Ext.isEmpty(toolbar.items))
            return {// 没有工具栏时，需要占个白条，避免太过拥挤
                xtype: 'toolbar',
                ui: 'frame'
            };

        return toolbar;
    },

    _createMessagePanel: function () {
        var me = this;
        return {
            xtype: 'messagepanel',
            itemId: 'messagePanel',
            width: '100%',
            dock: 'top',
            autoScroll: true,
            maxHeight: 250,
            margin: '0 0 10 0',
            listeners: {
                select: function (panel, message) {
                    me.onMessageSelect(message);
                }
            }
        };
    },

    getModuleContextValue: function (key) {
        var me = this;
        return !!me.moduleContext ? me.moduleContext[key] : undefined;
    },

    isValid: function () {
        var me = this;

        var errors = me.getErrors();
        me.down('#messagePanel').setMessages(errors);

        return Ext.isEmpty(errors);
    },

    /**
     * 界面刷新操作
     */
    onRefresh: function (urlParams) {
        var me = this;
        me.urlParams = urlParams;
        me.activateBtns();
    },

    activateBtns: function () {
        var me = this;
        me.items.each(function (item) {
            if (item instanceof Ext.button.Button) {//取消按钮的无效点击
                item.setRevoke(false);
            }
        });
    },

    /**
     * 旋转消息会触发，子类可重写来增加消息事件。
     *
     * @param message
     */
    onMessageSelect: function (message) {

    },

    /**
     * 从上下文中加载权限到viewModel
     */
    refreshAuthorizedPermissions: function () {
        var me = this,
            permissions = me.moduleContext['userAuthorizedPermissions'],
            authorize = {},
            stubs, stub;
        if (Ext.isEmpty(me.getViewModel())) {
            return;
        }

        Ext.Array.each(permissions, function (permission) {
            stubs = permission.split('.');
            stub = authorize;
            for (var i = 0; i < stubs.length; i++) {
                if (!stub[stubs[i]])
                    stub[stubs[i]] = {};
                if (i == stubs.length - 1) {
                    stub[stubs[i]] = 1;
                }
                stub = stub[stubs[i]];
            }
        });

        me.getViewModel().setData({
            authorize: authorize
        });
    },

    /**
     * 主要是清空验证
     */
    afterRefresh: function () {
        var me = this;
        me.down('#messagePanel').clearMessages();
        me.clearInvalid();
        Ext.defer(function () {
            me.focusOnFirst();
        }, 100);
    },

    /**
     * @private
     * @inheritdoc
     */
    beforeDestroy: function () {
        var me = this;

        if (me.rendered) {
            delete me.titlebar;
            delete me.toolbar;
            delete me.messagePanel;
        }
        me.callParent();
    }
});