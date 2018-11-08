/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-core
 * 文件名：	ProductDaoImpl.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.impl.product.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hd123.demo.impl.base.dao.BasicDaoImpl;
import com.hd123.demo.service.product.ProductState;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;
import com.hd123.rumba.commons.i18n.DefaultStringValue;
import com.hd123.rumba.commons.i18n.Resources;
import com.hd123.rumba.commons.jpa.query.executor.CountingStrategy;
import com.hd123.rumba.commons.jpa.query.executor.JpaQueryExecutor;
import com.hd123.rumba.commons.jpa.query.executor.QuerySelector;
import com.hd123.rumba.commons.jpa.query.sql.SQLSubquery;
import com.hd123.rumba.commons.lang.Assert;
import com.hd123.rumba.commons.lang.StringUtil;

/**
 * @author liuguilin
 * 
 */
@Repository(value = ProductDao.DEFAULT_CONTEXT_ID)
@Transactional(rollbackFor = Exception.class)
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class ProductDaoImpl extends BasicDaoImpl implements ProductDao {

  @PersistenceContext
  private EntityManager em;

  @Override
  public String save(PProduct perz) {
    Assert.assertArgumentNotNull(perz, "perz");

    if (perz.getUuid() == null) {
      em.persist(perz);
    } else {
      em.merge(perz);
    }
    em.flush();
    return perz.getUuid();
  }

  @Override
  public void delete(PProduct perz) {
    Assert.assertArgumentNotNull(perz, "perz");
    Assert.assertArgumentNotNull(perz.getUuid(), "perz");

    perz.setState(ProductState.deleted);
    em.merge(perz);
    em.flush();
  }

  @Override
  public void remove(PProduct perz) {
    Assert.assertArgumentNotNull(perz, "perz");
    em.remove(perz);
    em.flush();
  }

  @Override
  public void undelete(PProduct perz) {
    Assert.assertArgumentNotNull(perz, "perz");
    Assert.assertArgumentNotNull(perz.getUuid(), "perz");

    perz.setState(ProductState.using);
    em.merge(perz);
    em.flush();
  }

  @Override
  public PProduct get(String uuid) {
    if (StringUtil.isNullOrBlank(uuid))
      return null;

    return em.find(PProduct.class, uuid);
  }

  @Override
  public PProduct getByCode(String code) {
    if (StringUtil.isNullOrBlank(code))
      return null;

    String hql = "from " + PProduct.class.getName()
        + " o where o.code = :code and o.state = :state";
    Query query = em.createQuery(hql);
    query.setParameter("code", code);
    query.setParameter("state", ProductState.using);
    List<PProduct> list = query.getResultList();
    return list.size() > 0 ? list.get(0) : null;
  }

  @Override
  public QueryResult<PProduct> query(QueryDefinition definition) {
    if (definition == null)
      return null;

    SQLSubquery query = ProductSQLBuilder.getInstance().buildSQLSubquery(definition);

    QuerySelector selector = new JpaQueryExecutor(em, query, CountingStrategy.precise);
    QueryResult productStatus = selector.query(definition.getPage(), definition.getPageSize());

    QueryResult<PProduct> result = new QueryResult<PProduct>();
    result.setPaging(productStatus.getPaging());
    result.setRecords(productStatus.getRecords());
    return result;
  }

  public interface R {
    public static final R R = Resources.create(R.class);

    @DefaultStringValue("商品发生重复({0})")
    String captionDuplicate();
  }
}
