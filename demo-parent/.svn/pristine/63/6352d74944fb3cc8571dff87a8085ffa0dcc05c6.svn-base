/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2016，所有权利保留。
 * 
 * 项目名：	m3-commons-web
 * 文件名：	QueryFilter.java
 * 模块说明：	
 * 修改历史：
 * 2016年6月18日 - cRazy - 创建。
 */
package com.hd123.demo.query;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hd123.demo.util.JsonUtil;

/**
 * @author cRazy
 *
 */
public class QueryFilter {
  private String id;
  private String keyword;
  private int page;
  private int pageSize;
  private Map<String, Object> filter = new HashMap<String, Object>();
  private List<OrderSort> sorts = new ArrayList<OrderSort>();
  private List<String> fetchParts = new ArrayList<String>();

  /** 单个查询 */
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  /** 关键字 */
  public String getKeyword() {
    return keyword;
  }

  public void setKeyword(String keyword) {
    this.keyword = keyword;
  }

  public int getPage() {
    return page;
  }

  public void setPage(int page) {
    this.page = page;
  }

  /** 由于Extjs的翻页从1开始。此处取得page-1值。 */
  public int getCurrentPage() {
    return page > 0 ? page - 1 : page;
  }

  public int getPageSize() {
    return pageSize;
  }

  public void setPageSize(int pageSize) {
    this.pageSize = pageSize;
  }

  /** 过滤器 */
  public Map<String, Object> getFilter() {
    if (filter == null) {// 避免空指针
      filter = new HashMap<String, Object>();
    }
    return filter;
  }

  public void setFilter(Map<String, Object> filter) {
    this.filter = filter;
  }

  /** 用于接收前端提交的文本 */
  public void setSort(String sort) {
    this.sorts = JsonUtil.jsonToArrayList(sort, OrderSort.class);
  }

  /** 排序字段 */
  public List<OrderSort> getSorts() {
    return sorts;
  }

  public void setSorts(List<OrderSort> sorts) {
    this.sorts = sorts;
  }

  public List<String> getFetchParts() {
    return fetchParts;
  }

  public void setFetchParts(List<String> fetchParts) {
    if (fetchParts == null) {
      this.fetchParts.clear();
    } else {
      this.fetchParts = fetchParts;
    }
  }

  /**
   * 克隆，注意：非完全克隆
   */
  public QueryFilter clone() {
    QueryFilter target = new QueryFilter();
    target.setId(this.getId());
    target.setKeyword(this.getKeyword());
    target.setPage(this.getPage());
    target.setPageSize(this.getPageSize());
    target.getFilter().putAll(this.getFilter());
    target.getSorts().addAll(this.getSorts());
    target.getFetchParts().addAll(this.getFetchParts());
    return target;
  }
}
