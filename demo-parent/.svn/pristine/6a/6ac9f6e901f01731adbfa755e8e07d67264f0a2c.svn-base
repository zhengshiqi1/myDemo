/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-transport
 * 文件名：	RSProductQueryResultConverter.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.rs.service.product;

import com.hd123.demo.service.product.Product;
import com.hd123.rumba.commons.biz.query.QueryResult;
import com.hd123.rumba.commons.util.converter.ConversionException;
import com.hd123.rumba.commons.util.converter.Converter;
import com.hd123.rumba.commons.util.converter.ConverterUtil;

/**
 * @author liuguilin
 * 
 */
public class RSProductQueryResultConverter implements
    Converter<QueryResult<Product>, RSProductQueryResult> {

  @Override
  public RSProductQueryResult convert(QueryResult<Product> source) throws ConversionException {
    if (source == null) {
      return null;
    }

    RSProductQueryResult target = new RSProductQueryResult();
    if (source.getPaging() != null) {
      target.setPaging(source.getPaging().clone());
    }
    target.setRecords(ConverterUtil.convert(source.getRecords(), RSProductConverter.getInstance()));
    return target;
  }
}
