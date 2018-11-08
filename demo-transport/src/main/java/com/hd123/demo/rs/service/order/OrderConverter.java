package com.hd123.demo.rs.service.order;

import com.hd123.demo.service.order.Order;
import com.hd123.demo.service.order.OrderState;
import com.hd123.demo.service.order.OrderType;
import com.hd123.rumba.commons.util.converter.ConversionException;
import com.hd123.rumba.commons.util.converter.Converter;

/**
 * 
 * @author zhengshiqi
 *
 */
public class OrderConverter implements Converter<RSOrder, Order> {
  
  private static OrderConverter instance;

  public static OrderConverter getInstance() {
    if (instance==null) {
      instance = new OrderConverter();
    }
    return instance;
  }

  @Override
  public Order convert(RSOrder source) throws ConversionException {
    if (source == null){
      return null;
    }
    try {
      Order order = new Order();
      order.inject(source);
      order.setCode(source.getCode());
      order.setSupplier(source.getSupplier());
      order.setOrderDate(source.getOrderDate());
      order.setSubmitExpense(source.getSubmitExpense());
      order.setDeliveryMode(source.getDeliveryMode());
      order.setOrderType(source.getOrderType() == null?null:OrderType.valueOf(source.getOrderType()));
      order.setAddress(source.getAddress());
      order.setOrderProducts(source.getOrderProducts());
      order.setState(source.getState() == null?null:OrderState.valueOf(source.getState()));
      order.setSumPrice(source.getSumPrice());
      order.setSumQty(source.getSumQty());
      order.setVersion(source.getVersion());
      order.setVersionTime(source.getVersionTime());
      return order;
    } catch (Exception e) {
      throw new ConversionException(e);
    }
  }
}
