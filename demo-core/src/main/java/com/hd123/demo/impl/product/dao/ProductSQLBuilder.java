/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-core
 * 文件名：	ProductSQLBuilder.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.impl.product.dao;

import java.util.List;

import com.hd123.demo.impl.util.SQLBuilder;
import com.hd123.demo.service.product.ProductService;
import com.hd123.demo.service.product.ProductState;
import com.hd123.rumba.commons.biz.query.QueryCondition;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryOrder;
import com.hd123.rumba.commons.jpa.query.sql.SCE;
import com.hd123.rumba.commons.jpa.query.sql.SQLFromClause;
import com.hd123.rumba.commons.jpa.query.sql.SQLOrderClause;
import com.hd123.rumba.commons.jpa.query.sql.SQLSubquery;
import com.hd123.rumba.commons.lang.StringUtil;

/**
 * @author liuguilin
 * 
 */
public class ProductSQLBuilder extends SQLBuilder {
  private static ProductSQLBuilder instance;

  public static ProductSQLBuilder getInstance() {
    if (instance == null)
      instance = new ProductSQLBuilder();
    return instance;
  }

  public SQLSubquery buildSQLSubquery(QueryDefinition definition) {
    assert definition != null;

    SQLFromClause fromClause = new SQLFromClause();
    fromClause.addTable(PProduct.class.getName(), "p");

    SQLSubquery query = new SQLSubquery();
    query.addSelect("p");
    query.setFromClause(fromClause);
    query.setWhere(groupConditions(definition.getConditions()));
    query.setOrderClause(buildOrder(definition.getOrders()));
    return query;
  }

  @Override
  protected SCE buildCondition(QueryCondition condition) {
    assert condition != null;

    SCE sce = null;
    try {
      if (ProductService.CONDITION_CODE_EQUALS.equals(condition.getOperation())) {
        sce = SCE.cond("p.code=?", condition.getParameter());
      } else if (ProductService.CONDITION_CODE_STARTWITH.equals(condition.getOperation())) {
        sce = SCE.cond("p.code like ?", condition.getParameter(), SCE.WC_RIGHT);
      } else if (ProductService.CONDITION_STATE_EQUALS.equals(condition.getOperation())) {
        sce = SCE.cond("p.state = ?",
            StringUtil.toEnum(condition.getParameter().toString(), ProductState.class));
      } else if (ProductService.CONDITION_UUID_EQUALS.equals(condition.getOperation())) {
        sce = SCE.cond("p.uuid=?", condition.getParameter());
      } else if (ProductService.CONDITION_UUID_IN.equals(condition.getOperation())) {
        sce = SCE.cond("p.uuid in ?", condition.getParameter());
      } else if (ProductService.CONDITION_NAME_EQUALS.equals(condition.getOperation())) {
        sce = SCE.cond("p.name = ?", condition.getParameter());
      } else if (ProductService.CONDITION_NAME_LIKE.equals(condition.getOperation())) {
        sce = SCE.cond("p.name like ?", condition.getParameter(), SCE.WC_BOTH);
      } else if (ProductService.CONDITION_BANK_EQUALS.equals(condition.getOperation())) {
        sce = SCE.cond("p.bank.uuid = ? ", condition.getParameter());
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
      if (ProductService.ORDER_BY_CODE.equals(order.getField())) {
        orderClause.addField("p.code", order.getDirection());
      } else if (ProductService.ORDER_BY_NAME.equals(order.getField())) {
        orderClause.addField("p.name", order.getDirection());
      } else if (ProductService.ORDER_BY_QTY.equals(order.getField())) {
        orderClause.addField("p.qty", order.getDirection());
      } else if (ProductService.ORDER_BY_STATE.equals(order.getField())) {
        orderClause.addField("p.state", order.getDirection());
      } else if (ProductService.ORDER_BY_REMARK.equals(order.getField())) {
        orderClause.addField("p.remark", order.getDirection());
      }
    }

    return orderClause;
  }
}