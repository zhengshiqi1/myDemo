/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-server
 * 文件名：	RSProductServiceImpl.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.rs.server.product;

import javax.ws.rs.core.Response;

import com.hd123.demo.rs.server.BasicRSService;
import com.hd123.demo.rs.server.util.ExceptionResponseBuilder;
import com.hd123.demo.rs.service.product.ProductConverter;
import com.hd123.demo.rs.service.product.RSProduct;
import com.hd123.demo.rs.service.product.RSProductConverter;
import com.hd123.demo.rs.service.product.RSProductQueryResult;
import com.hd123.demo.rs.service.product.RSProductQueryResultConverter;
import com.hd123.demo.rs.service.product.RSProductService;
import com.hd123.demo.service.product.Product;
import com.hd123.demo.service.product.ProductService;
import com.hd123.ia.audit.service.Keywords;
import com.hd123.rumba.commons.biz.entity.OperateContext;
import com.hd123.rumba.commons.biz.query.BeanQueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;
import com.hd123.rumba.commons.biz.query.converter.QueryDefinitionConverter;
import com.hd123.rumba.commons.rs.entity.OperateContextConverter;
import com.hd123.rumba.commons.rs.entity.RSOperateContext;

/**
 * @author liuguilin
 * 
 */
public class RSProductServiceImpl extends BasicRSService implements RSProductService {

  private ProductService productService;

  @Override
  public Response save(RSProduct rsProduct, RSOperateContext operCtx) {
    String savedUuid = null;
    try {
      Product product = ProductConverter.getInstance().convert(rsProduct);
      savedUuid = productService.save(product,
          new OperateContextConverter<OperateContext>().convert(operCtx));
    } catch (Exception e) {
      return ExceptionResponseBuilder.build(e);
    }

    OperateContext<Object> inputOperCtx = new OperateContextConverter<Object>().convert(operCtx);
    auditLog("saveNew", inputOperCtx, null, null);

    return Response.ok(savedUuid).build();
  }

  @Override
  public Response delete(String uuid, long version, RSOperateContext operCtx) {
    try {
      productService.delete(uuid, version,
          new OperateContextConverter<OperateContext>().convert(operCtx));
    } catch (Exception e) {
      return ExceptionResponseBuilder.build(e);
    }
    OperateContext<Object> inputOperCtx = new OperateContextConverter<Object>().convert(operCtx);
    auditLog("delete", inputOperCtx, new Keywords(0, "uuid", uuid), null);
    return Response.ok().build();
  }

  @Override
  public Response remove(String uuid, long version, RSOperateContext operCtx)
      throws IllegalArgumentException {
    try {
      productService.remove(uuid, version,
          new OperateContextConverter<OperateContext>().convert(operCtx));
    } catch (Exception e) {
      return ExceptionResponseBuilder.build(e);
    }
    OperateContext<Object> inputOperCtx = new OperateContextConverter<Object>().convert(operCtx);
    auditLog("remove", inputOperCtx, new Keywords(0, "uuid", uuid), null);
    return Response.ok().build();
  }

  @Override
  public Response undelete(String uuid, long version, RSOperateContext operCtx) {
    try {
      productService.undelete(uuid, version,
          new OperateContextConverter<OperateContext>().convert(operCtx));
    } catch (Exception e) {
      return ExceptionResponseBuilder.build(e);
    }
    OperateContext<Object> inputOperCtx = new OperateContextConverter<Object>().convert(operCtx);
    auditLog("undelete", inputOperCtx, new Keywords(0, "uuid", uuid), null);
    return Response.ok().build();
  }

  @Override
  public RSProduct get(String uuid) {
    try {
      Product product = productService.get(uuid);
      return RSProductConverter.getInstance().convert(product);
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public RSProduct getByCode(String code) {
    try {
      Product product = productService.getByCode(code);
      return RSProductConverter.getInstance().convert(product);
    } catch (Exception e) {
      return null;
    }
  }

  @Override
  public Response query(BeanQueryDefinition queryDefinition) {
    QueryResult<Product> queryResult = null;
    try {
      queryResult = productService.query(new QueryDefinitionConverter().convert(queryDefinition));
    } catch (Exception e) {
      return ExceptionResponseBuilder.build(e);
    }

    RSProductQueryResult rsResult = new RSProductQueryResultConverter().convert(queryResult);
    return Response.ok(rsResult).build();
  }

  public ProductService getProductService() {
    return productService;
  }

  public void setProductService(ProductService productService) {
    this.productService = productService;
  }

}
