/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-transport
 * 文件名：	ProductServiceRSProxy.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.rs.proxy.product;

import javax.ws.rs.MessageProcessingException;
import javax.ws.rs.core.Response;

import com.hd123.demo.rs.service.product.ProductConverter;
import com.hd123.demo.rs.service.product.RSProduct;
import com.hd123.demo.rs.service.product.RSProductConverter;
import com.hd123.demo.rs.service.product.RSProductQueryResult;
import com.hd123.demo.rs.service.product.RSProductService;
import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.demo.service.product.Product;
import com.hd123.demo.service.product.ProductService;
import com.hd123.rumba.commons.biz.entity.OperateContext;
import com.hd123.rumba.commons.biz.query.BeanQueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;
import com.hd123.rumba.commons.biz.query.converter.BeanQueryDefinitionConverter;
import com.hd123.rumba.commons.lang.Assert;
import com.hd123.rumba.commons.lang.StringUtil;
import com.hd123.rumba.commons.rs.entity.RSOperateContextConverter;
import com.hd123.rumba.commons.util.converter.ConverterUtil;

/**
 * @author liuguilin
 * 
 */
public class ProductServiceRSProxy implements ProductService {

  private RSProductService rsProductService;

  @Override
  public String save(Product product, OperateContext operCtx) throws DemoServiceException {
    Assert.assertArgumentNotNull(product, "product");
    Assert.assertArgumentNotNull(operCtx, "operCtx");

    Response response = rsProductService.save(RSProductConverter.getInstance().convert(product),
        new RSOperateContextConverter().convert(operCtx));
    handleSaveException(response);
    return response.readEntity(String.class);
  }

  @Override
  public void delete(String uuid, long version, OperateContext operCtx) throws DemoServiceException {
    Assert.assertArgumentNotNull(uuid, "uuid");
    Assert.assertArgumentNotNull(operCtx, "operCtx");

    Response response = rsProductService.delete(uuid, version,
        new RSOperateContextConverter().convert(operCtx));
    handleDeleteException(response);
  }

  @Override
  public void remove(String uuid, long version, OperateContext operCtx) throws DemoServiceException {
    Assert.assertArgumentNotNull(uuid, "uuid");
    Assert.assertArgumentNotNull(operCtx, "operCtx");

    Response response = rsProductService.delete(uuid, version,
        new RSOperateContextConverter().convert(operCtx));
    handleDeleteException(response);
  }

  @Override
  public void undelete(String uuid, long version, OperateContext operCtx)
      throws DemoServiceException {
    Assert.assertArgumentNotNull(uuid, "uuid");
    Assert.assertArgumentNotNull(operCtx, "operCtx");

    Response response = rsProductService.undelete(uuid, version,
        new RSOperateContextConverter().convert(operCtx));
    handleUndeleteException(response);
  }

  @Override
  public Product get(String uuid) {
    if (StringUtil.isNullOrBlank(uuid))
      return null;

    RSProduct rsProduct = rsProductService.get(uuid);
    Product prodcut = ProductConverter.getInstance().convert(rsProduct);
    return prodcut;
  }

  @Override
  public Product getByCode(String code) {
    if (StringUtil.isNullOrBlank(code))
      return null;

    RSProduct rsProduct = rsProductService.getByCode(code);
    Product prodcut = ProductConverter.getInstance().convert(rsProduct);
    return prodcut;
  }

  @Override
  public QueryResult<Product> query(QueryDefinition definition) {
    if (definition == null)// 条件为空时则构造一个，寓意为查询条件为空。即查询全部
      definition = new QueryDefinition();

    BeanQueryDefinition rsDefinition = new BeanQueryDefinitionConverter().convert(definition);
    Response response = rsProductService.query(rsDefinition);
    if (response.getStatus() != Response.Status.OK.getStatusCode()) {
      return null;
    }

    RSProductQueryResult qr = response.readEntity(RSProductQueryResult.class);
    QueryResult<Product> result = new QueryResult<Product>();
    result.setPaging(qr.getPaging().clone());
    result.setRecords(ConverterUtil.convert(qr.getRecords(), ProductConverter.getInstance()));
    return result;
  }

  /**
   * 保存异常处理
   * 
   * @param response
   * @throws IllegalArgumentException
   * @throws DemoServiceException
   */
  private void handleSaveException(Response response) throws IllegalArgumentException,
      DemoServiceException {
    handleException(response);
  }

  /**
   * 删除异常处理
   * 
   * @param response
   * @throws IllegalStateException
   * @throws MessageProcessingException
   * @throws ProductServiceException
   */
  private void handleDeleteException(Response response) throws DemoServiceException,
      MessageProcessingException, IllegalStateException {
    if (Response.Status.BAD_REQUEST.getStatusCode() == response.getStatus())
      throw new IllegalArgumentException(response.readEntity(String.class));
    else if (Response.Status.CONFLICT.getStatusCode() == response.getStatus())
      throw new IllegalStateException(response.readEntity(String.class), null);
    else if (Response.Status.INTERNAL_SERVER_ERROR.getStatusCode() == response.getStatus())
      throw new DemoServiceException(response.readEntity(String.class));
    else if (Response.Status.OK.getStatusCode() != response.getStatus())
      throw new DemoServiceException(response.readEntity(String.class));
  }

  /**
   * 恢复删除异常处理
   * 
   * @param response
   * @throws IllegalStateException
   * @throws MessageProcessingException
   * @throws ProductServiceException
   */
  private void handleUndeleteException(Response response) throws DemoServiceException,
      MessageProcessingException, IllegalStateException {
    if (Response.Status.BAD_REQUEST.getStatusCode() == response.getStatus())
      throw new IllegalArgumentException(response.readEntity(String.class));
    else if (Response.Status.CONFLICT.getStatusCode() == response.getStatus())
      throw new IllegalStateException(response.readEntity(String.class), null);
    else if (Response.Status.INTERNAL_SERVER_ERROR.getStatusCode() == response.getStatus())
      throw new DemoServiceException(response.readEntity(String.class));
    else if (Response.Status.OK.getStatusCode() != response.getStatus())
      throw new DemoServiceException(response.readEntity(String.class));
  }

  private void handleException(Response response) throws IllegalArgumentException,
      DemoServiceException {
    if (Response.Status.BAD_REQUEST.getStatusCode() == response.getStatus())
      throw new IllegalArgumentException(response.readEntity(String.class));
    else if (Response.Status.INTERNAL_SERVER_ERROR.getStatusCode() == response.getStatus())
      throw new DemoServiceException(response.readEntity(String.class));
    else if (Response.Status.OK.getStatusCode() != response.getStatus())
      throw new DemoServiceException(response.readEntity(String.class));
  }

  public RSProductService getRsProductService() {
    return rsProductService;
  }

  public void setRsProductService(RSProductService rsProductService) {
    this.rsProductService = rsProductService;
  }
}
