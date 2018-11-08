/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2013，所有权利保留。
 *
 * 项目名：	demo-transport
 * 文件名：	RSProductConverter.java
 * 模块说明：
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.rs.service.product;

import com.hd123.demo.service.product.Product;
import com.hd123.rumba.commons.util.converter.ConversionException;
import com.hd123.rumba.commons.util.converter.Converter;

/**
 * @author liuguilin
 * 
 */
public class RSProductConverter implements Converter<Product, RSProduct> {

  private static RSProductConverter instance;

  public static RSProductConverter getInstance() {
    if (instance == null)
      instance = new RSProductConverter();
    return instance;
  }

  @Override
  public RSProduct convert(Product source) throws ConversionException {
    if (source == null)
      return null;

    try {
      RSProduct target = new RSProduct();
      target.inject(source);
      target.setCode(source.getCode());
      target.setName(source.getName());
      target.setBank(source.getBank());
      target.setState(source.getState() == null ? null : source.getState().name());
      target.setRemark(source.getRemark());
      target.setQty(source.getQty());
      target.setPrice(source.getPrice());
      return target;
    } catch (Exception e) {
      throw new ConversionException(e);
    }
  }
}