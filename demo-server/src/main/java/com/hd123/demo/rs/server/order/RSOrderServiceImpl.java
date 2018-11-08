package com.hd123.demo.rs.server.order;

import javax.ws.rs.core.Response;

import com.hd123.demo.rs.server.BasicRSService;
import com.hd123.demo.rs.server.util.ExceptionResponseBuilder;
import com.hd123.demo.rs.service.order.OrderConverter;
import com.hd123.demo.rs.service.order.RSOrder;
import com.hd123.demo.rs.service.order.RSOrderConverter;
import com.hd123.demo.rs.service.order.RSOrderQueryResult;
import com.hd123.demo.rs.service.order.RSOrderQueryResultConverter;
import com.hd123.demo.rs.service.order.RSOrderService;
import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.demo.service.order.Order;
import com.hd123.demo.service.order.OrderService;
import com.hd123.ia.audit.service.Keywords;
import com.hd123.rumba.commons.biz.entity.OperateContext;
import com.hd123.rumba.commons.biz.query.BeanQueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;
import com.hd123.rumba.commons.biz.query.converter.QueryDefinitionConverter;
import com.hd123.rumba.commons.rs.entity.OperateContextConverter;
import com.hd123.rumba.commons.rs.entity.RSOperateContext;

/**
 * 
 * @author zhengshiqi
 *
 */
public class RSOrderServiceImpl extends BasicRSService implements RSOrderService {

  private OrderService orderService;

  @Override
  public Response save(RSOrder rsOrder, RSOperateContext operCtx) throws DemoServiceException {
    String savedUuid = null;
    try {
      Order order = OrderConverter.getInstance().convert(rsOrder);
      savedUuid = orderService.save(order,
          new OperateContextConverter<OperateContext>().convert(operCtx));
    } catch (Exception e) {
      return ExceptionResponseBuilder.build(e);
    }
    OperateContext<Object> inputOperCtx = new OperateContextConverter<Object>().convert(operCtx);
    // 记录日志
    auditLog("save", inputOperCtx, null, null);
    return Response.ok(savedUuid).build();
  }

  @Override
  public Response query(BeanQueryDefinition definition) {
    QueryResult<Order> queryResult = null;
    try {
      queryResult = orderService.query(new QueryDefinitionConverter().convert(definition));
    } catch (Exception e) {
      return ExceptionResponseBuilder.build(e);
    }

    RSOrderQueryResult rsResult = new RSOrderQueryResultConverter().convert(queryResult);
    return Response.ok(rsResult).build();
  }

  @Override
  public Response delete(String uuid, long version, RSOperateContext operCtx)
      throws IllegalArgumentException {
    try {
      orderService.delete(uuid, version,
          new OperateContextConverter<OperateContext>().convert(operCtx));
    } catch (Exception e) {
      return ExceptionResponseBuilder.build(e);
    }
    OperateContext<Object> inputOperCtx = new OperateContextConverter<Object>().convert(operCtx);
    auditLog("delete", inputOperCtx, new Keywords(0, "uuid", uuid), null);
    return Response.ok().build();
  }

  @Override
  public Response undelete(String uuid, long version, RSOperateContext operCtx)
      throws IllegalArgumentException {
    try {
      orderService.undelete(uuid, version,
          new OperateContextConverter<OperateContext>().convert(operCtx));
    } catch (Exception e) {
      return ExceptionResponseBuilder.build(e);
    }
    OperateContext<Object> inputOperCtx = new OperateContextConverter<Object>().convert(operCtx);
    auditLog("undelete", inputOperCtx, new Keywords(0, "uuid", uuid), null);
    return Response.ok().build();
  }

  @Override
  public RSOrder getByUuid(String uuid) {
    try {
      Order order = orderService.get(uuid);
      return RSOrderConverter.getInstance().convert(order);
    } catch (Exception e) {
      return null;
    }
  }

  public OrderService getOrderService() {
    return orderService;
  }

  public void setOrderService(OrderService orderService) {
    this.orderService = orderService;
  }

}
