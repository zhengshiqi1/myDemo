/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-transport
 * 文件名：	RSProductQueryResult.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin- 创建。
 */
package com.hd123.demo.rs.service.product;

import java.io.Serializable;
import java.util.List;

import com.hd123.rumba.commons.biz.query.QueryResultPaging;

/**
 * 商品查询页RS对象。
 * 
 * @author huangjunxian
 * 
 */
public class RSProductQueryResult implements Serializable {
  private static final long serialVersionUID = 3549914728381974835L;
  /** 分页信息 */
  private QueryResultPaging paging;
  /** 数据集 */
  private List<RSProduct> records;

  public QueryResultPaging getPaging() {
    return paging;
  }

  public void setPaging(QueryResultPaging paging) {
    this.paging = paging;
  }

  public List<RSProduct> getRecords() {
    return records;
  }

  public void setRecords(List<RSProduct> records) {
    this.records = records;
  }

}
