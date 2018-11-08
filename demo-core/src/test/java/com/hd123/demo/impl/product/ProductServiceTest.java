/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-core
 * 文件名：	ProductServiceTest.java
 * 模块说明：	
 * 修改历史：
 * 2015-5-25 - qyh - 创建。
 */
package com.hd123.demo.impl.product;

import org.junit.Assert;

import com.hd123.demo.impl.AbstractTest;
import com.hd123.demo.service.product.Product;
import com.hd123.demo.service.product.ProductState;
import com.hd123.rumba.commons.biz.entity.UCN;

/**
 * @author qyh
 * 
 */
public class ProductServiceTest extends AbstractTest {
//  @Test
  public void saveNew() throws Exception {
    Product product = new Product();
    product.setCode("qyh01");
    product.setName("qyh商品");
    product.setState(ProductState.using);
    product.setBank(new UCN("123", "qyh", "qyh"));
    productService.save(product, getOperCtx());

    product = productService.getByCode(product.getCode());

    product = productService.get(product.getUuid());
    Assert.assertNotNull(product);
    Assert.assertEquals(product.getCode(), "qyh01");
  }
}
