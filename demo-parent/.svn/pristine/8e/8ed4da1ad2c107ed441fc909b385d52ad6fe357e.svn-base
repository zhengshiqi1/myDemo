/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-api
 * 文件名：	Product.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-24 - huangjunxian- 创建。
 */
package com.hd123.demo.service.product;

import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.rumba.commons.biz.entity.OperateContext;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;

/**
 * 商品服务| 业务层接口
 * 
 * @author huangjunxian
 * 
 */
public interface ProductService {

  public static final String DEFAULT_CONTEXT_ID = "demo-api.productService";

  /* =========================查询条件============================ */
  /** 查询条件(String)：uuid等于。 */
  public static final String CONDITION_UUID_EQUALS = "uuid.equals";
  /** 查询条件(String[])：uuid在...之中。 */
  public static final String CONDITION_UUID_IN = "uuid.in";
  /** 查询条件(String)：代码等于。 */
  public static final String CONDITION_CODE_EQUALS = "code.equals";
  /** 查询条件(String)：名字等于。 */
  public static final String CONDITION_NAME_EQUALS = "name.equals";
  /** 查询条件(String)：代码起始于。 */
  public static final String CONDITION_CODE_STARTWITH = "code.startWith";
  /** 查询条件(String)：名字类似于。 */
  public static final String CONDITION_NAME_LIKE = "name.like";
  /** 查询条件(boolean)：状态等于。 */
  public static final String CONDITION_STATE_EQUALS = "state.equals";
  /** 查询条件(String)：银行等于。 */
  public static final String CONDITION_BANK_EQUALS = "bank.equals";

  /* =========================排序条件============================ */
  /** 代码 */
  public static final String ORDER_BY_CODE = "code";
  /** 名称 */
  public static final String ORDER_BY_NAME = "name";
  /** 数量 */
  public static final String ORDER_BY_QTY = "qty";
  /** 状态 */
  public static final String ORDER_BY_STATE = "state";
  /** 银行 */
  public static final String ORDER_BY_BANK = "bank.code";
  /** 说明 */
  public static final String ORDER_BY_REMARK = "remark";

  /**
   * 保存商品。
   * 
   * @param product
   *          商品对象，not null。
   * @param operCtx
   *          操作信息，not null。
   * @return 商品uuid。
   * @throws IllegalArgumentException
   */
  String save(Product product, OperateContext operCtx) throws DemoServiceException;

  /**
   * 删除商品。
   * 
   * @param uuid
   *          商品uuid， not null。
   * @param version
   *          版本号。
   * @param operCtx
   *          操作信息，not null。
   * @throws IllegalArgumentException
   */
  void delete(String uuid, long version, OperateContext operCtx) throws DemoServiceException;

  /**
   * 彻底删除商品。
   * 
   * @param uuid
   *          商品uuid， not null。
   * @param version
   *          版本号。
   * @param operCtx
   *          操作信息，not null。
   * @throws IllegalArgumentException
   */
  void remove(String uuid, long version, OperateContext operCtx) throws DemoServiceException;

  /**
   * 恢复删除商品。
   * 
   * @param uuid
   *          商品uuid， not null。
   * @param version
   *          版本号。
   * @param operCtx
   *          操作信息，not null。
   * @throws IllegalArgumentException
   */
  void undelete(String uuid, long version, OperateContext operCtx) throws DemoServiceException;

  /**
   * 根据uuid获取商品。
   * 
   * @param uuid
   *          商品uuid。
   * @return 商品对象。
   */
  Product get(String uuid);

  /**
   * 根据代码获取商品。
   * 
   * @param code
   *          商品代码。
   * @return 商品对象。
   */
  Product getByCode(String code);

  /**
   * flecs查询。
   * 
   * @param definition
   *          查询定义，为空时将返回null。
   * @return 查询页。
   */
  QueryResult<Product> query(QueryDefinition definition);
}
