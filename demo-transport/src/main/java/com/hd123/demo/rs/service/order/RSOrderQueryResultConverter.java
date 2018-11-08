package com.hd123.demo.rs.service.order;

import com.hd123.demo.service.order.Order;
import com.hd123.rumba.commons.biz.query.QueryResult;
import com.hd123.rumba.commons.util.converter.ConversionException;
import com.hd123.rumba.commons.util.converter.Converter;
import com.hd123.rumba.commons.util.converter.ConverterUtil;

/**
 * 
 * @author zhengshiqi
 *
 */
public class RSOrderQueryResultConverter implements Converter<QueryResult<Order>, RSOrderQueryResult>{

  @Override
  public RSOrderQueryResult convert(QueryResult<Order> source) throws ConversionException {
    if (source == null) {
      return null;
    }
    RSOrderQueryResult target = new RSOrderQueryResult();
    if (source.getPaging() != null) {
      target.setPaging(source.getPaging().clone());
    }
    target.setRecords(ConverterUtil.convert(source.getRecords(), RSOrderConverter.getInstance()));
    return target;
  }

}
