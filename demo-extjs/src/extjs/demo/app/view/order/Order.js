/**
 * Created by zhengshiqi on 2018/10/18.
 */
Ext.define('demo.view.order.Order', {
    extend: 'Ext.Container',
    alias: 'demo.order',
    singleton: true,
    alternateClassName: 'Order',

    moduleId: 'demo.order',
    moduleCaption: '订单',
    permResourceId: 'demo.order',

    servicePath: 'order'
});