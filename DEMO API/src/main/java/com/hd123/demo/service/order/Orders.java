package com.hd123.demo.service.order;

/**
 * 
 * @author zhengshiqi
 *
 */
public class Orders {
  /** 查询条件(String)：uuid等于。 */
  public static final String CONDITION_UUID_EQUALS = "uuid.equals";
  /** 查询条件(String[])：uuid在...之中。 */
  public static final String CONDITION_UUID_IN = "uuid.in";
  /** 查询条件(boolean)：订单类型等于。 */
  public static final String CONDITION_ORDERTYPE_EQUALS = "orderType.equals";
  /** 查询条件(String)：编码起始于。 */
  public static final String CONDITION_CODE_STARTWITH = "code.startWith";
  /** 查询条件(String)：编码等于。 */
  public static final String CONDITION_CODE_EQUALS = "code.equals";
  /** 查询条件(String)：供应商等于。 */
  public static final String CONDITION_SUPPLIER_EQUALS = "supplier.equals";
  /** 查询条件(String)：订单明细等于。 */
  public static final String CONDITION_ORDERPRODUCTS_EQUALS = "orderProducts.equals";
  /** 查询条件(boolean)：状态等于。 */
  public static final String CONDITION_STATE_EQUALS = "state.equals";

  /* ==================排序条件============================ */
  /** 供应商 */
  public static final String ORDER_BY_SUPPLIER = "supplier.code";
  /** 代码 */
  public static final String ORDER_BY_CODE = "code";
  /** 创建日期 */
  public static final String ORDER_BY_ORDERDATE = "orderDate";
  /** 送货方式 */
  public static final String ORDER_BY_DELIVERYMODE = "deliveryMode.code";
  /** 发货库区 */
  public static final String ORDER_BY_ADDRESS = "address.code";
  /** 订单类型 */
  public static final String ORDER_BY_ORDERTYPE = "orderType";
  /** 订单状态 */
  public static final String ORDER_BY_STATE = "state";
  /** 总价格 */
  public static final String ORDER_BY_SUMPRICE = "sumPrice";
  /** 总价格 */
  public static final String ORDER_BY_SUMQTY = "sumQty";
  /** 修改时间 */
  public static final String ORDER_BY_LAST_MODIFY_TIME = "lastModifyInfo.time";
}
