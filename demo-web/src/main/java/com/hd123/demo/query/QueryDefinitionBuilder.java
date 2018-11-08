/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2016，所有权利保留。
 * 
 * 项目名：	m3-commons-web
 * 文件名：	QueryFilterDecorator.java
 * 模块说明：	
 * 修改历史：
 * 2016年8月10日 - cRazy - 创建。
 */
package com.hd123.demo.query;

import java.util.List;
import java.util.Map;

import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryOrderDirection;

/**
 * @author cRazy
 *
 */
public class QueryDefinitionBuilder {

  protected static final String FILTER_KEYWORD = "keyword";

  protected static final String FILTER_CREATEINFO_CREATOR_CODE = "createInfo_creator_code";
  protected static final String FILTER_CREATEINFO_CREATOR_NAME = "createInfo_creator_name";
  protected static final String FILTER_CREATEINFO_TIME = "createInfo_time";

  protected static final String FILTER_LASTMODIFYINFO_CREATOR_CODE = "lastModifyInfo_creator_code";
  protected static final String FILTER_LASTMODIFYINFO_CREATOR_NAME = "lastModifyInfo_creator_name";
  protected static final String FILTER_LASTMODIFYINFO_TIME = "lastModifyInfo_time";

  public QueryDefinition build(QueryFilter queryFilter) {
    return build(new QueryDefinition(), queryFilter);
  }

  public QueryDefinition build(QueryDefinition queryDef, QueryFilter queryFilter) {
    if (queryDef == null || queryFilter == null) {
      return queryDef;
    }

    buildFilter(queryDef, queryFilter.getFilter());
    buildSort(queryDef, queryFilter.getSorts());

    queryDef.setPage(queryFilter.getCurrentPage());
    queryDef.setPageSize(queryFilter.getPageSize());

    return queryDef;
  }

  /** 解析过滤器 */
  protected void buildFilter(QueryDefinition queryDef, Map<String, Object> filter) {
    if (filter == null)
      return;

    for (String key : filter.keySet()) {
      try {
        buildFilter(queryDef, key, filter.get(key));
      } catch (Exception e) {
        // 处理失败则跳过
      }
    }
  }

  /**
   * 解析过滤，默认采用fieldName=value的方案。
   */
  protected void buildFilter(QueryDefinition queryDef, String fieldName, Object value)
      throws Exception {
  }

  /** 处理排序 */
  protected void buildSort(QueryDefinition queryDef, List<OrderSort> sorts) {
    for (OrderSort sort : sorts) {
      if (sort.getProperty() == null)
        continue;

      QueryOrderDirection dir = OrderSort.ASC.equals(sort.getDirection()) ? QueryOrderDirection.asc
          : QueryOrderDirection.desc;
      buildSort(queryDef, sort, dir);
    }
  }

  /**
   * 用户可以重写该方法来对特殊的sort进行处理
   */
  protected void buildSort(QueryDefinition queryDef, OrderSort sort, QueryOrderDirection dir) {
    queryDef.addOrder(sort.getProperty(), dir);
  }

}
