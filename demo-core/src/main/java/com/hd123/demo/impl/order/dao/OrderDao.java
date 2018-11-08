package com.hd123.demo.impl.order.dao;

import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;

/**
 * 
 * @author zhengshiqi
 *
 */
public interface OrderDao {

  public static final String DEFAULT_CONTEXT_ID = "demo-core.dao.OrderDao";

  /**
   * 保存订单
   * 
   * @param order
   * @return
   */
  String save(POrder order) throws DemoServiceException;

  /**
   * 根据订单编号查询订单
   * 
   * @param code
   * @return
   */
  POrder selectByCode(String code);

  /**
   * 根据订单UUID查询订单
   * 
   * @param uuid
   * @return
   */
  POrder select(String uuid);

  /**
   * 根据查询条件查询订单
   * 
   * @param definition
   *          查询条件，为空时返回空
   * @return 订单
   */
  QueryResult<POrder> query(QueryDefinition definition);

  /**
   * 删除订单（订单状态的改变）
   * 
   * @param order
   */
  void delete(POrder order);

  /**
   * 恢复删除
   * 
   * @param order
   */
  void undelete(POrder order);

}
