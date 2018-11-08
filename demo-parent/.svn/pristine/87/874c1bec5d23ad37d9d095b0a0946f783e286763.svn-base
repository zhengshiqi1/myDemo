/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-core
 * 文件名：	ProductDao.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.impl.product.dao;

import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;

/**
 * @author liuguilin
 * 
 */
public interface ProductDao {

  public static final String DEFAULT_CONTEXT_ID = "demo-core.dao.ProductDao";

  /**
   * 保存商品
   * 
   * @param perz
   *          商品
   * @return uuid
   */
  String save(PProduct perz);
  
  /**
   * 删除商品
   * 
   * @param perz
   *          商品
   * @return uuid
   */
  void delete(PProduct perz);
  
  /**
   * 删除商品
   * 
   * @param perz
   *          商品
   * @return uuid
   */
  void remove(PProduct perz);
  
  /**
   * 恢复删除商品
   * 
   * @param perz
   *          商品
   * @return uuid
   */
  void undelete(PProduct perz);

  /**
   * 根据uuid获取商品
   * 
   * @param uuid
   *          商品uuid
   * @return 商品
   */
  PProduct get(String uuid);

  /**
   * 根据商品代码获取商品
   * 
   * @param code
   *          商品代码
   * @return 商品
   */
  PProduct getByCode(String code);

  /**
   * 根据查询条件查询商品
   * 
   * @param definition
   *          查询条件，为空时返回空
   * @return 商品
   */
  QueryResult<PProduct> query(QueryDefinition definition);

}
