/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('demo.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',

    requires: [
        'Cxt.util.LoadMark',
        'Cxt.util.Window',
        'Ext.util.Format'
    ],

    routes: {
        ':name': {
            action: 'showView',
            conditions: {
                ':name': '([0-9a-zA-Z\;\.\&\?\=\_\%\-]+)'
            }
        }
    },

    isMainFrame: function () {
        var wnd = window;
        while (wnd != wnd.parent) {
            if (wnd.isMainFrame)
                return true;
            wnd = wnd.parent;
        }
        return wnd.isMainFrame;
    },

    redirectMainFrame: function () {
        return Cxt.util.Window.navigate('../www/com.hd123.rumba.webframe.gwt.mainframe.MainFrame/MainFrame.html', {
            startPage: window.location.href
        });
    },

    showView: function (name) {
        console.log('进入模块');
        var me = this, mainView = me.getView(),
            moduleId = name,
            index = name.indexOf('?');
        if (name === 'catalog') {
            mainView.removeAll();
            mainView.add({
                xtype: name
            });
            return;
        }

        me.entryTime = new Date();
        if (index > 0) {
            moduleId = name.substring(0, index);
        }
        var urlParams = Cxt.util.Window.parseParams(name);
        if (Ext.mode != 'development' && !me.isMainFrame()) {
            return me.redirectMainFrame();
        }

        if (!urlParams['jsessionid']) {
            return Cxt.util.Window.navigate(window.location.href, {
                jsessionid: Ext.util.Format.date(new Date(), 'YmdHisu')
            });
        }
        try {
            Cxt.util.LoadMark.initMark(me.getView());

            var module = Ext.syncRequire(Ext.ClassManager.getNameByAlias(moduleId));
            if (Ext.isEmpty(module)) {
                Ext.raise("You must specify a module config.");
            }
            if (Ext.isEmpty(module.moduleId)) {
                Ext.raise("You must specify a moduleId config.");
            }

            console.log('读取模块配置：' + module.moduleCaption + '，用时：' + (new Date() - me.entryTime));
            Cxt.util.Window.setTitle(module.moduleCaption);
            me.switchView(module, urlParams);
        } catch (e) {
            mainView.setHtml("不正确的路由" + name + ":" + e);
        }
    },

    switchView: function (module, urlParams) {
        var me = this,
            mainView = me.getView(),
            node = urlParams['node'],
            xtype = module.moduleId + '.' + node;

        try {
            mainView.removeAll();
        } catch (e) {
            Ext.Logger.warn(e);
        }

        var cmp = Ext.create({
            xtype: xtype,
            module: module
        });
        mainView.add(cmp);

        console.log('构建界面用时：' + (new Date() - me.entryTime));
        if (Ext.isFunction(cmp.onRefresh)) {
            cmp.onRefresh(urlParams);
        }
        if (Ext.isFunction(cmp.afterRefresh)) {
            cmp.afterRefresh();
        }
        console.log('界面刷新用时：' + (new Date() - me.entryTime));
    }
});
