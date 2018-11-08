package com.hd123.demo.rs.service.order;

import com.hd123.demo.service.order.Order;
import com.hd123.rumba.commons.util.converter.ConversionException;
import com.hd123.rumba.commons.util.converter.Converter;

public class RSOrderConverter implements Converter<Order, RSOrder>{

  public static RSOrderConverter instance;
  
  public static RSOrderConverter getInstance() {
    if (instance == null) {
      instance = new RSOrderConverter();
    }
    return instance;
  }

  @Override
  public RSOrder convert(Order source) throws ConversionException {
    if (source == null) {
      return null;
    }
    try {
      RSOrder order = new RSOrder();
      order.inject(source);
      order.setCode(source.getCode());
      order.setSupplier(source.getSupplier());
      order.setOrderDate(source.getOrderDate());
      order.setSubmitExpense(source.getSubmitExpense());
      order.setDeliveryMode(source.getDeliveryMode());
      order.setOrderType(source.getOrderType() == null ? null : source.getOrderType().name());
      order.setAddress(source.getAddress());
      order.setOrderProducts(source.getOrderProducts());  
      order.setState(source.getState() == null ? null : source.getState().name());
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
