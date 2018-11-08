/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2016，所有权利保留。
 * 
 * 项目名：	cre-portal
 * 文件名：	BrandQueryBuilder.java
 * 模块说明：	
 * 修改历史：
 * 2016年10月9日 - lizongyi - 创建。
 */
package com.hd123.demo.controller.product;

import java.util.List;

import org.springframework.stereotype.Component;

import com.hd123.demo.query.OrderSort;
import com.hd123.demo.query.QueryDefinitionBuilder;
import com.hd123.demo.service.product.ProductService;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryOrderDirection;

/**
 * @author lizongyi
 *
 */
@Component
public class ProductQueryBuilder extends QueryDefinitionBuilder {

  public static final String FILTER_ALL = "all";
  public static final String FILTER_STATE = "state";
  public static final String FILTER_STATE_USING = "using";
  public static final String FILTER_STATE_DELETED = "deleted";
  public static final String FILTER_CODE = "code";
  public static final String FILTER_NAME = "name";
  public static final String FILTER_BANK = "bank";

  /** =========================排序字段============================ */
  private static final String SORT_BANK = "bank";

  @Override
  protected void buildFilter(QueryDefinition queryDef, String fieldName, Object value)
      throws Exception {
    if (queryDef == null || fieldName == null || value == null) {
      return;
    }

    if (FILTER_STATE.equals(fieldName)) {
      if (value instanceof List) {
        for (Object state : ((List) value)) {
          queryDef.addCondition(ProductService.CONDITION_STATE_EQUALS, state);
        }
      } else if (value instanceof String && FILTER_ALL.equals(value) == false) {
        queryDef.addCondition(ProductService.CONDITION_STATE_EQUALS, value);
      }
    } else if (FILTER_CODE.equals(fieldName)) {
      queryDef.addCondition(ProductService.CONDITION_CODE_STARTWITH, value);
    } else if (FILTER_NAME.equals(fieldName)) {
      queryDef.addCondition(ProductService.CONDITION_NAME_LIKE, value);
    } else if (FILTER_BANK.equals(fieldName)) {
      queryDef.addCondition(ProductService.CONDITION_BANK_EQUALS, value);
    } else {
      super.buildFilter(queryDef, fieldName, value);
    }
  }

  @Override
  protected void buildSort(QueryDefinition queryDef, OrderSort sort, QueryOrderDirection dir) {
    if (queryDef == null || sort == null)
      return;

    if (SORT_BANK.equals(sort.getProperty())) {
      queryDef.addOrder(ProductService.ORDER_BY_BANK, dir);
    } else {
      super.buildSort(queryDef, sort, dir);
    }
  }
}
