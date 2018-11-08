package com.hd123.demo.impl.order.dao;

import java.util.List;

import com.hd123.demo.impl.util.SQLBuilder;
import com.hd123.demo.service.order.OrderState;
import com.hd123.demo.service.order.Orders;
import com.hd123.rumba.commons.biz.query.QueryCondition;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryOrder;
import com.hd123.rumba.commons.jpa.query.sql.SCE;
import com.hd123.rumba.commons.jpa.query.sql.SQLFromClause;
import com.hd123.rumba.commons.jpa.query.sql.SQLOrderClause;
import com.hd123.rumba.commons.jpa.query.sql.SQLSubquery;
import com.hd123.rumba.commons.lang.StringUtil;

/**
 * sql查询构建辅助类   ？？？？？？？？？？？？？？？
 * @author zhengshiqi
 *
 */
public class OrderSQLBuilder extends SQLBuilder{
  
  private static OrderSQLBuilder instance; 
  public static OrderSQLBuilder getInstance() {
    if (instance==null) {
      instance = new OrderSQLBuilder();
    }
    return instance;
  }

  @Override
  protected SCE buildCondition(QueryCondition condition) {
    assert condition != null;

    SCE sce = null;
    try {
      if (Orders.CONDITION_CODE_EQUALS.equals(condition.getOperation())) {
        sce = SCE.cond("p.code=?", condition.getParameter());
      } else if (Orders.CONDITION_CODE_STARTWITH.equals(condition.getOperation())) {
        sce = SCE.cond("p.code like ?", condition.getParameter(), SCE.WC_RIGHT);
      } else if (Orders.CONDITION_STATE_EQUALS.equals(condition.getOperation())) {
        sce = SCE.cond("p.state = ?",
            StringUtil.toEnum(condition.getParameter().toString(), OrderState.class));
      } else if (Orders.CONDITION_UUID_EQUALS.equals(condition.getOperation())) {
        sce = SCE.cond("p.uuid=?", condition.getParameter());
      } else if (Orders.CONDITION_UUID_IN.equals(condition.getOperation())) {
        sce = SCE.cond("p.uuid in ?", condition.getParameter());
      } else if (Orders.CONDITION_SUPPLIER_EQUALS.equals(condition.getOperation())) {
        sce = SCE.cond("p.supplier.uuid = ? ", condition.getParameter());
      } else if(Orders.CONDITION_ORDERPRODUCTS_EQUALS.equals(condition.getOperation())){
        sce = SCE.cond("exists(select 1 from "+POrderProduct.class.getName()+" b where b.product.uuid = ? and p.uuid  = b.ord.uuid)",condition.getParameter());
      }
      return sce;
    } catch (Exception e) {
      throw new IllegalArgumentException("condition");
    }
  }

  @Override
  protected SQLOrderClause buildOrder(List<QueryOrder> orders) {
    SQLOrderClause orderClause = new SQLOrderClause();
    for (QueryOrder order : orders) {
      if (Orders.ORDER_BY_CODE.equals(order.getField())) {
        orderClause.addField("p.code", order.getDirection());
      } else if (Orders.ORDER_BY_ORDERDATE.equals(order.getField())) {
        orderClause.addField("p.orderDate", order.getDirection());
      } else if (Orders.ORDER_BY_ORDERTYPE.equals(order.getField())) {
        orderClause.addField("p.orderType", order.getDirection());
      } else if (Orders.ORDER_BY_STATE.equals(order.getField())) {
        orderClause.addField("p.state", order.getDirection());
      }else if (Orders.ORDER_BY_SUMPRICE.equals(order.getField())) {
        orderClause.addField("p.sumPrice", order.getDirection());
      }else if (Orders.ORDER_BY_SUMQTY.equals(order.getField())) {
        orderClause.addField("p.sumQty", order.getDirection());
      }else if (Orders.ORDER_BY_SUPPLIER.equals(order.getField())) {
        orderClause.addField("p.supplier.code", order.getDirection());
      }else if (Orders.ORDER_BY_LAST_MODIFY_TIME.equals(order.getField())) {
        orderClause.addField("p.lastModifyInfo.time", order.getDirection());
      }
    }

    return orderClause;
  }
  
  public SQLSubquery buildSQLSubquery(QueryDefinition definition) {
    assert definition != null;

    SQLFromClause fromClause = new SQLFromClause();
    fromClause.addTable(POrder.class.getName(), "p");

    SQLSubquery query = new SQLSubquery();
    query.addSelect("p");
    query.setFromClause(fromClause);
    query.setWhere(groupConditions(definition.getConditions()));
    query.setOrderClause(buildOrder(definition.getOrders()));
    return query;
  }

}
