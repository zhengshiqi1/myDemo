package com.hd123.demo.rs.proxy.order;

import javax.ws.rs.MessageProcessingException;
import javax.ws.rs.core.Response;

import com.hd123.demo.rs.service.order.OrderConverter;
import com.hd123.demo.rs.service.order.RSOrder;
import com.hd123.demo.rs.service.order.RSOrderConverter;
import com.hd123.demo.rs.service.order.RSOrderQueryResult;
import com.hd123.demo.rs.service.order.RSOrderService;
import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.demo.service.order.Order;
import com.hd123.demo.service.order.OrderService;
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
 * 
 * @author zhengshiqi
 *
 */
public class OrderServiceRSProxy implements OrderService {

  private RSOrderService rsOrderService;

  @Override
  public String save(Order order, OperateContext operCtx) throws DemoServiceException {
    Assert.assertArgumentNotNull(order, "order");
    Assert.assertArgumentNotNull(operCtx, "operCtx");
    RSOrder order2 = RSOrderConverter.getInstance().convert(order);
    Response response = rsOrderService.save(order2,
        new RSOperateContextConverter().convert(operCtx));
    handleSaveException(response);
    return response.readEntity(String.class);
  }

  @Override
  public QueryResult<Order> query(QueryDefinition definition) {
    if (definition == null) {// 条件为空时则构造一个，寓意为查询条件为空。即查询全部
      definition = new QueryDefinition();
    }
    BeanQueryDefinition rsDefinition = new BeanQueryDefinitionConverter().convert(definition);
    Response response = rsOrderService.query(rsDefinition);
    if (response.getStatus() != Response.Status.OK.getStatusCode()) {
      return null;
    }

    RSOrderQueryResult qr = response.readEntity(RSOrderQueryResult.class);
    QueryResult<Order> result = new QueryResult<Order>();
    result.setPaging(qr.getPaging().clone());
    result.setRecords(ConverterUtil.convert(qr.getRecords(), OrderConverter.getInstance()));
    return result;
  }

  @Override
  public void delete(String uuid, long version, OperateContext operCtx) throws DemoServiceException {
    Assert.assertArgumentNotNull(uuid, "uuid");
    Assert.assertArgumentNotNull(operCtx, "operCtx");

    Response response = rsOrderService.delete(uuid, version,
        new RSOperateContextConverter().convert(operCtx));
    handleDeleteException(response);
  }

  @Override
  public void undelete(String uuid, long version, OperateContext operCtx)
      throws DemoServiceException {
    Assert.assertArgumentNotNull(uuid, "uuid");
    Assert.assertArgumentNotNull(operCtx, "operCtx");

    Response response = rsOrderService.undelete(uuid, version,
        new RSOperateContextConverter().convert(operCtx));
    handleDeleteException(response);

  }

  @Override
  public Order get(String uuid) {
    if (StringUtil.isNullOrBlank(uuid)) {
      return null;
    }
    RSOrder rsOrder = rsOrderService.getByUuid(uuid);
    Order order = OrderConverter.getInstance().convert(rsOrder);
    return order;
  }

  /**
   * 保存异常的处理
   * 
   * @param response
   * @throws IllegalArgumentException
   * @throws DemoServiceException
   */
  private void handleSaveException(Response response) throws IllegalArgumentException,
      DemoServiceException {
    handleException(response);
  }

  private void handleException(Response response) throws IllegalArgumentException,
      DemoServiceException {
    if (Response.Status.BAD_REQUEST.getStatusCode() == response.getStatus()) {
      throw new IllegalArgumentException(response.readEntity(String.class));
    } else if (Response.Status.INTERNAL_SERVER_ERROR.getStatusCode() == response.getStatus()) {
      throw new DemoServiceException(response.readEntity(String.class));
    } else if (Response.Status.OK.getStatusCode() != response.getStatus()) {
      throw new DemoServiceException(response.readEntity(String.class));
    }
  }

  /**
   * 删除异常的处理
   * 
   * @param response
   * @throws DemoServiceException
   * @throws MessageProcessingException
   * @throws IllegalStateException
   */
  private void handleDeleteException(Response response) throws DemoServiceException,
      MessageProcessingException, IllegalStateException {
    if (Response.Status.BAD_REQUEST.getStatusCode() == response.getStatus()) {
      throw new IllegalArgumentException(response.readEntity(String.class));
    } else if (Response.Status.CONFLICT.getStatusCode() == response.getStatus()) {
      throw new IllegalStateException(response.readEntity(String.class), null);
    } else if (Response.Status.INTERNAL_SERVER_ERROR.getStatusCode() == response.getStatus()) {
      throw new DemoServiceException(response.readEntity(String.class));
    } else if (Response.Status.OK.getStatusCode() != response.getStatus()) {
      throw new DemoServiceException(response.readEntity(String.class));
    }
  }

  public RSOrderService getRsOrderService() {
    return rsOrderService;
  }

  public void setRsOrderService(RSOrderService rsOrderService) {
    this.rsOrderService = rsOrderService;
  }

}
