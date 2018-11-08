/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2016，所有权利保留。
 * 
 * 项目名：	m3-commons-web
 * 文件名：	QueryResult.java
 * 模块说明：	
 * 修改历史：
 * 2016年6月18日 - cRazy - 创建。
 */
package com.hd123.demo.query;

import java.util.HashMap;
import java.util.Map;

/**
 * @author cRazy
 *
 */
public class SummaryQueryResult<T> extends com.hd123.rumba.commons.biz.query.QueryResult<T> {
  private static final long serialVersionUID = -4015127648315031668L;

  /** 附带扩展信息，如合计等 */
  private Map<String, Object> summary = new HashMap<String, Object>();

  public static SummaryQueryResult newInstance(Object object) {
    if (object instanceof com.hd123.rumba.commons.biz.query.QueryResult == false)
      return null;

    com.hd123.rumba.commons.biz.query.QueryResult source = (com.hd123.rumba.commons.biz.query.QueryResult) object;
    SummaryQueryResult target = new SummaryQueryResult();

    target.setPaging(source.getPaging());
    target.setRecords(source.getRecords());
    if (source instanceof SummaryQueryResult) {
      target.setSummary(((SummaryQueryResult) source).getSummary());
    }
    return target;
  }

  public SummaryQueryResult() {
  }

  public Map<String, Object> getSummary() {
    return summary;
  }

  public void setSummary(Map<String, Object> summary) {
    this.summary = summary;
  }
}
