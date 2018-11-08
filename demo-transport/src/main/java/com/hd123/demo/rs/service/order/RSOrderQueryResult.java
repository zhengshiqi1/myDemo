package com.hd123.demo.rs.service.order;

import java.io.Serializable;
import java.util.List;

import com.hd123.rumba.commons.biz.query.QueryResultPaging;

/**
 * 
 * @author zhengshiqi
 *
 */
public class RSOrderQueryResult implements Serializable{

  private static final long serialVersionUID = 8505928446567519281L;
  
  /** 分页信息 */
  private QueryResultPaging paging;
  /** 数据集 */
  private List<RSOrder> records;

  public QueryResultPaging getPaging() {
    return paging;
  }

  public void setPaging(QueryResultPaging paging) {
    this.paging = paging;
  }

  public List<RSOrder> getRecords() {
    return records;
  }

  public void setRecords(List<RSOrder> records) {
    this.records = records;
  }

  
}
