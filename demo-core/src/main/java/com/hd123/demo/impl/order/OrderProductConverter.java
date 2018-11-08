package com.hd123.demo.impl.order;

import java.util.ArrayList;
import java.util.List;

import com.hd123.demo.impl.order.dao.POrderProduct;
import com.hd123.demo.impl.product.ProductConverter;
import com.hd123.demo.service.orderproduct.OrderProduct;
import com.hd123.rumba.commons.util.converter.ConversionException;
import com.hd123.rumba.commons.util.converter.Converter;

public class OrderProductConverter implements Converter<POrderProduct, OrderProduct>{
  
  private static OrderProductConverter instance;
  

  public static OrderProductConverter getInstance() {
    if (instance==null) {
      instance = new OrderProductConverter();
    }
    return instance;
  }



  @Override
  public OrderProduct convert(POrderProduct source) throws ConversionException {
    if (source == null) {
      return null;
    }
    OrderProduct orderProduct = new OrderProduct();
    orderProduct.setAllPrice(source.getAllPrice());
    orderProduct.setBuyQty(source.getBuyQty());
    orderProduct.setProduct(ProductConverter.getInstance().convert(source.getProduct()));
    orderProduct.setRemark(source.getRemark());
    orderProduct.setVersion(source.getVersion());
    orderProduct.setVersionTime(source.getVersionTime());
    return orderProduct;
  }
 

  public List<OrderProduct> convert(List<POrderProduct> source) throws ConversionException {
    if (source == null) {
      return null;
    }
    List<OrderProduct> list = new ArrayList<OrderProduct>();
    for (POrderProduct pOrderProduct : source) {
      list.add(convert(pOrderProduct));
    }
    return list;
  }

}
