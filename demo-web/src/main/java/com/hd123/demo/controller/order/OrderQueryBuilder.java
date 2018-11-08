package com.hd123.demo.controller.order;

import java.util.List;

import org.springframework.stereotype.Component;

import com.hd123.demo.query.OrderSort;
import com.hd123.demo.query.QueryDefinitionBuilder;
import com.hd123.demo.service.order.Orders;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryOrderDirection;

/**
 * 
 * @author zhengshiqi
 *
 */
@Component
public class OrderQueryBuilder extends QueryDefinitionBuilder{
  
  public static final String FILTER_ALL = "all";
  public static final String FILTER_ORDERTYPE = "orderType";
  public static final String FILTER_ORDERTYPE_YI = "yi";
  public static final String FILTER_ORDERTYPE_SHI = "shi";
  public static final String FILTER_ORDERTYPE_ZHU = "zhu";
  public static final String FILTER_ORDERTYPE_XING = "xing";
  public static final String FILTER_CODE = "code";
  public static final String FILTER_SUPPLIER = "supplier";
  public static final String FILTER_ORDERPRODUCTS = "orderProducts";
  public static final String FILTER_STATE = "state";

  /** =========================排序字段============================ */
  private static final String SORT_SUPPLIER = "supplier";
  /** 修改时间 */
  public static final String SORT_BY_LAST_MODIFY_TIME = "lastModifyInfo";
//  单号，供应商，状态，总数量，总金额，最后修改信息。（所有列支持排序，默认以单号降序排列，其中供应商列不支持分组
  
  
  @Override
  protected void buildFilter(QueryDefinition queryDef, String fieldName, Object value)
      throws Exception {
    if (queryDef == null || fieldName == null || value == null) {
      return;
    }

    
    if (FILTER_STATE.equals(fieldName)) {
      if (value instanceof List) {
        for (Object state : ((List) value)) {
          queryDef.addCondition(Orders.CONDITION_STATE_EQUALS, state);
        }
      } else if (value instanceof String && FILTER_ALL.equals(value) == false) {
        queryDef.addCondition(Orders.CONDITION_STATE_EQUALS, value);
      }
    } else if (FILTER_ORDERTYPE.equals(fieldName)) {
      if (value instanceof List) {
        for (Object orderType : ((List) value)) {
          queryDef.addCondition(Orders.CONDITION_ORDERTYPE_EQUALS, orderType);
        }
      } 
    } else if (FILTER_CODE.equals(fieldName)) {
      queryDef.addCondition(Orders.CONDITION_CODE_STARTWITH, value);
    } else if (FILTER_SUPPLIER.equals(fieldName)) {
      queryDef.addCondition(Orders.CONDITION_SUPPLIER_EQUALS, value);
    } else if (FILTER_ORDERPRODUCTS.equals(fieldName)) {
      queryDef.addCondition(Orders.CONDITION_ORDERPRODUCTS_EQUALS, value);
    } else if (FILTER_ORDERPRODUCTS.equals(fieldName)) {
      queryDef.addCondition(Orders.CONDITION_ORDERPRODUCTS_EQUALS, value);
    } else {
      super.buildFilter(queryDef, fieldName, value);
    }
  }

  @Override
  protected void buildSort(QueryDefinition queryDef, OrderSort sort, QueryOrderDirection dir) {
    if (queryDef == null || sort == null){
      return;
    }
    if (SORT_SUPPLIER.equals(sort.getProperty())) {
      queryDef.addOrder(Orders.ORDER_BY_SUPPLIER, dir);
    } if (SORT_BY_LAST_MODIFY_TIME.equals(sort.getProperty())) {
      queryDef.addOrder(Orders.ORDER_BY_LAST_MODIFY_TIME, dir);
    }else {
      super.buildSort(queryDef, sort, dir);
    }
  }
}
