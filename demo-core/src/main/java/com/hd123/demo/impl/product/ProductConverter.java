/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2013，所有权利保留。
 * 
 * 项目名：	proq-ejb
 * 文件名：	ProductStatusConverter.java
 * 模块说明：	
 * 修改历史：
 * 2013-11-20 - wulei - 创建。
 */
package com.hd123.demo.impl.product;

import com.hd123.demo.impl.product.dao.PProduct;
import com.hd123.demo.service.product.Product;
import com.hd123.rumba.commons.biz.entity.UCN;
import com.hd123.rumba.commons.util.converter.ConversionException;
import com.hd123.rumba.commons.util.converter.Converter;

/**
 * 商品状态转换器
 * 
 * @author wulei
 * 
 */
public class ProductConverter implements Converter<PProduct, Product> {
  
  private static ProductConverter instance;

  public static ProductConverter getInstance() {
    if (instance==null) {
      instance = new ProductConverter();
    }
    return instance;
  }

  @Override
  public Product convert(PProduct source) throws ConversionException {
    if (source == null)
      return null;
    Product target = new Product();
    target.inject(source);
    target.setUuid(source.getUuid());
    target.setCode(source.getCode());
    target.setName(source.getName());
    target.setQty(source.getQty());
    target.setBank(UCN.newInstance(source.getBank()));
    target.setState(source.getState());
    target.setRemark(source.getRemark());
    target.setVersion(source.getVersion());
    target.setPrice(source.getPrice());
    return target;
  }

}
