/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2014，所有权利保留。
 * 
 * 项目名：	demo-core
 * 文件名：	SQLBuilder.java
 * 模块说明：	
 * 修改历史：
 * 2014-1-16 - wulei - 创建。
 */
package com.hd123.demo.impl.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hd123.rumba.commons.biz.query.QueryCondition;
import com.hd123.rumba.commons.biz.query.QueryOrder;
import com.hd123.rumba.commons.jpa.query.sql.SCE;
import com.hd123.rumba.commons.jpa.query.sql.SCEAnd;
import com.hd123.rumba.commons.jpa.query.sql.SCEOr;
import com.hd123.rumba.commons.jpa.query.sql.SQLOrderClause;

/**
 * SQL查询构建辅助类。
 * 
 * @author liuguilin
 * 
 */
public abstract class SQLBuilder {
  protected abstract SCE buildCondition(QueryCondition condition);

  protected abstract SQLOrderClause buildOrder(List<QueryOrder> orders);

  /**
   * 根据语音将查询条件分组并构建SQL查询条件。同分组之间为“或”，不同分组之间为“并”。
   * 
   * @param condtions
   *          查询条件
   * @return SQL条件集。
   */
  protected SCEAnd groupConditions(Collection<QueryCondition> condtions) {
    Map<String, List<SCE>> conditions = new HashMap<String, List<SCE>>();

    for (QueryCondition condition : condtions) {
      SCE operand = buildCondition(condition);
      if (operand == null)
        continue;
      List<SCE> list = conditions.get(condition.getOperation());
      if (list == null) {
        list = new ArrayList<SCE>();
        conditions.put(condition.getOperation(), list);
      }
      list.add(operand);
    }
    SCEAnd where = new SCEAnd();
    where.append(SCE.cond("1=1"));
    for (String operation : conditions.keySet()) {
      List<SCE> sceList = conditions.get(operation);
      if (sceList.isEmpty()) {
        continue;
      }
      if (sceList.size() == 1) {
        where.append(sceList.get(0));
      } else {
        SCEOr or = new SCEOr();
        for (SCE sce : sceList) {
          or.append(sce);
        }
        where.append(or);
      }
    }
    return where;
  }

}
