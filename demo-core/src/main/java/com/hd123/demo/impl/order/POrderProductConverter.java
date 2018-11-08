package com.hd123.demo.impl.order;

import java.util.ArrayList;
import java.util.List;

import com.hd123.demo.impl.order.dao.POrderProduct;
import com.hd123.demo.impl.product.PProductConverter;
import com.hd123.demo.service.orderproduct.OrderProduct;
import com.hd123.rumba.commons.util.converter.ConversionException;
import com.hd123.rumba.commons.util.converter.Converter;

public class POrderProductConverter implements Converter<OrderProduct, POrderProduct>{
  
  private static POrderProductConverter instance;
 
  public static POrderProductConverter getInstance() {
    if (instance == null) {
      instance = new POrderProductConverter();
    }
    return instance;
  }

  @Override
  public POrderProduct convert(OrderProduct source) throws ConversionException {
    
    if (source == null) {
      return null;
    }
    POrderProduct pOrderProduct= new POrderProduct();
    pOrderProduct.setAllPrice(source.getAllPrice());
    pOrderProduct.setBuyQty(source.getBuyQty());
    pOrderProduct.setProduct(PProductConverter.getInstance().convert(source.getProduct()));
    pOrderProduct.setRemark(source.getRemark());
    pOrderProduct.setVersion(source.getVersion());
    pOrderProduct.setVersionTime(source.getVersionTime());
    return pOrderProduct;
  }
  
  public List<POrderProduct> convert(List<OrderProduct> source) throws ConversionException {
    
    if (source == null) {
      return null;
    }
    List<POrderProduct> list = new ArrayList<POrderProduct>();
    for (OrderProduct orderProduct : source) {
      list.add(convert(orderProduct));
    }
    return list;
  }

}
