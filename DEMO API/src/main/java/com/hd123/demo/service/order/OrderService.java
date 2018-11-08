package com.hd123.demo.service.order;

import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.rumba.commons.biz.entity.OperateContext;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;

/**
 * 订单业务层接口
 * 
 * @author zhengshiqi
 *
 */
public interface OrderService {

  public static final String DEFAULT_CONTEXT_ID = "demo-api.orderService";

  /**
   * 保存订单
   * 
   * @param order 订单信息
   * @param operCtx 操作信息
   * @return
   * @throws DemoServiceException
   */
  String save(Order order, OperateContext operCtx) throws DemoServiceException;

  /**
   * 根据条件查询
   * 
   * @param definition 查询条件
   * @return
   */
  QueryResult<Order> query(QueryDefinition definition);

  /**
   * 删除订单（订单状态的改变）
   * 
   * @param uuid
   * @param version 版本号
   * @param operCtx 操作信息
   * @throws DemoServiceException
   */
  void delete(String uuid, long version, OperateContext operCtx) throws DemoServiceException;

  /**
   * 恢复删除订单
   * 
   * @param uuid
   * @param version
   * @param operCtx
   * @throws DemoServiceException
   */
  void undelete(String uuid, long version, OperateContext operCtx) throws DemoServiceException;

  /**
   * 根据UUID查询订单
   * 
   * @param uuid
   * @return
   */
  Order get(String uuid);

}
