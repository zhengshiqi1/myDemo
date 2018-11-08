package com.hd123.demo.impl.order;

import com.hd123.demo.impl.base.PUCN;
import com.hd123.demo.impl.order.dao.POrder;
import com.hd123.demo.impl.order.dao.POrderProduct;
import com.hd123.demo.service.order.Order;
import com.hd123.rumba.commons.util.converter.ConversionException;
import com.hd123.rumba.commons.util.converter.Converter;

public class POrderConverter implements Converter<Order, POrder>{

  private static POrderConverter instance = null;

  public static POrderConverter getInstance() {
    if (instance == null)
      instance = new POrderConverter();
    return instance;
  }
  
  @Override
  public POrder convert(Order source) throws ConversionException {
    if (source == null) {
      return null;
    }
    POrder order = new POrder();
    order.inject(source);
    order.setUuid(source.getUuid());
    order.setCode(source.getCode());
    order.setSupplier(PUCN.newInstance(source.getSupplier()));
    order.setOrderDate(source.getOrderDate());
    order.setSubmitExpense(source.getSubmitExpense());
    order.setDeliveryMode(PUCN.newInstance(source.getDeliveryMode()));
    order.setOrderType(source.getOrderType());
    order.setAddress(PUCN.newInstance(source.getAddress()));
    order.setOrderProducts(POrderProductConverter.getInstance().convert(source.getOrderProducts()));
    for (POrderProduct product : order.getOrderProducts()) {
      product.setOrd(order);
    }
    order.setState(source.getState());
    order.setSumPrice(source.getSumPrice());
    order.setSumQty(source.getSumQty());
    order.setVersion(source.getVersion());
    order.setVersionTime(source.getVersionTime());
    return order;
  }

}
