/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2016，所有权利保留。
 * 
 * 项目名：	demo-transport
 * 文件名：	ProductTest.java
 * 模块说明：	
 * 修改历史：
 * 2016年3月24日 - cRazy - 创建。
 */
package com.hd123.demo.rs.proxy.product;

import java.math.BigDecimal;

import org.junit.Assert;

import com.hd123.demo.rs.proxy.BaseProxyTest;
import com.hd123.demo.service.product.Product;
import com.hd123.demo.service.product.ProductService;
import com.hd123.demo.service.product.ProductState;
import com.hd123.rumba.commons.biz.entity.UCN;

/**
 * @author cRazy
 *
 */
public class ProductTest extends BaseProxyTest {
//  @Test
  public void saveNew() throws Exception {
    Product product = new Product();
    product.setCode("qyh0251");
    product.setName("qyh商品");
    product.setQty(BigDecimal.ONE);
    product.setState(ProductState.using);
    product.setBank(new UCN("123", "qyh", "qyh"));
    getProductService().save(product, operCtx);

    product = getProductService().getByCode(product.getCode());

    product = getProductService().get(product.getUuid());
    Assert.assertNotNull(product);
    Assert.assertEquals(product.getCode(), "qyh0251");
  }

  private ProductService getProductService() {
    return appCtx.getBean(ProductService.class);
  }
}
