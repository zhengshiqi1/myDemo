package com.hd123.demo.impl.order;

import org.hibernate.collection.PersistentBag;

import com.hd123.demo.impl.order.dao.POrder;
import com.hd123.demo.service.order.Order;
import com.hd123.rumba.commons.biz.entity.UCN;
import com.hd123.rumba.commons.util.converter.ConversionException;
import com.hd123.rumba.commons.util.converter.Converter;

/**
 * 订单状态转换器
 * @author zhengshiqi
 *
 */
public class OrderConverter implements Converter<POrder, Order>{
  
  public static OrderConverter instance;
  

  public static OrderConverter getInstance() {
    if (instance == null) {
      instance = new OrderConverter();
    }
    return instance;
  }

  @Override
  public Order convert(POrder source) throws ConversionException {
    if (source==null) {
      return null;
    }
    Order order = new Order();
    order.inject(source);
    order.setUuid(source.getUuid());
    order.setCode(source.getCode());
    order.setSupplier(UCN.newInstance(source.getSupplier()));
    order.setOrderDate(source.getOrderDate());
    order.setSubmitExpense(source.getSubmitExpense());
    order.setDeliveryMode(UCN.newInstance(source.getDeliveryMode()));
    order.setOrderType(source.getOrderType());
    order.setAddress(UCN.newInstance(source.getAddress()));
    if (source.getOrderProducts() instanceof PersistentBag) {
      order.setOrderProducts(null);
    }else {
      order.setOrderProducts(OrderProductConverter.getInstance().convert(source.getOrderProducts()));
    }
    order.setState(source.getState());
    order.setSumPrice(source.getSumPrice());
    order.setSumQty(source.getSumQty());
    order.setVersion(source.getVersion());
    order.setVersionTime(source.getVersionTime());
    return order;
  }

}
