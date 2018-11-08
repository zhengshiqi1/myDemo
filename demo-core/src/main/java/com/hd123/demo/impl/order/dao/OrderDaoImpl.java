package com.hd123.demo.impl.order.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hd123.demo.impl.base.dao.BasicDaoImpl;
import com.hd123.demo.impl.product.dao.PProduct;
import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.demo.service.order.OrderState;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;
import com.hd123.rumba.commons.jpa.query.executor.CountingStrategy;
import com.hd123.rumba.commons.jpa.query.executor.JpaQueryExecutor;
import com.hd123.rumba.commons.jpa.query.executor.QuerySelector;
import com.hd123.rumba.commons.jpa.query.sql.SQLSubquery;
import com.hd123.rumba.commons.lang.Assert;
import com.hd123.rumba.commons.lang.StringUtil;

@Repository(value = OrderDao.DEFAULT_CONTEXT_ID)
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class OrderDaoImpl extends BasicDaoImpl implements OrderDao {

  @PersistenceContext
  private EntityManager em;

  /**
   * 保存订单
   * 
   * @param order
   * @return
   */
  @Override
  @Transactional(rollbackFor = Exception.class)
  public String save(POrder order) throws DemoServiceException {
    // 断言函数，对象不是null，是null则抛出异常
    Assert.assertArgumentNotNull(order, "order");
    if (order.getUuid() == null) {
      em.persist(order);
    } else {
      removeDetails(order.getUuid());
      em.merge(order);
    }
    em.flush();
    return order.getUuid();
  }

  private void removeDetails(String uuid) throws DemoServiceException {
    String hql = "delete " + POrderProduct.class.getName() + " a where a.ord.uuid = :uuid";
    em.createQuery(hql).setParameter("uuid", uuid).executeUpdate();
  }

  /**
   * 根据订单编号查询订单
   * 
   * @param code
   * @return
   */
  @Override
  public POrder selectByCode(String code) {
    if (StringUtil.isNullOrBlank(code)) {
      return null;
    }
    String hql = "from " + POrder.class.getName() + " o where o.code = :code";
    Query query = em.createQuery(hql);
    query.setParameter("code", code);
    List<POrder> list = query.getResultList();
    return list.size() > 0 ? list.get(0) : null;
  }

  /**
   * 根据查询条件查询订单
   * 
   * @param definition
   *          查询条件，为空时返回空
   * @return 订单
   */
  @Override
  public QueryResult<POrder> query(QueryDefinition definition) {
    if (definition == null) {
      return null;
    }
    SQLSubquery query = OrderSQLBuilder.getInstance().buildSQLSubquery(definition);

    QuerySelector selector = new JpaQueryExecutor(em, query, CountingStrategy.precise);
    QueryResult ordeResult = selector.query(definition.getPage(), definition.getPageSize());

    QueryResult<POrder> result = new QueryResult<POrder>();
    result.setPaging(ordeResult.getPaging());
    result.setRecords(ordeResult.getRecords());
    return result;
  }

  /**
   * 根据UUID查询订单
   */
  @Override
  public POrder select(String uuid) {
    if (StringUtil.isNullOrBlank(uuid)) {
      return null;
    }
    POrder pOrder = em.find(POrder.class, uuid);
    String hql = "from " + POrderProduct.class.getName() + " a where a.ord.uuid = :uuid";
    List<POrderProduct> list = em.createQuery(hql).setParameter("uuid", pOrder.getUuid())
        .getResultList();
    for (POrderProduct pOrderProduct : list) {
      PProduct pProduct = em.find(PProduct.class, pOrderProduct.getProduct().getUuid());
      pOrderProduct.setProduct(pProduct);
    }
    pOrder.setOrderProducts(list);
    return pOrder;
  }

  /**
   * 删除订单
   */
  @Override
  @Transactional(rollbackFor = Exception.class)
  public void delete(POrder order) {
    Assert.assertArgumentNotNull(order, "order");
    Assert.assertArgumentNotNull(order.getUuid(), "order");
    order.setState(OrderState.deleted);
    em.merge(order);
    em.flush();
  }

  /**
   * 恢复删除
   */
  @Override
  @Transactional(rollbackFor = Exception.class)
  public void undelete(POrder order) {
    Assert.assertArgumentNotNull(order, "order");
    Assert.assertArgumentNotNull(order.getUuid(), "order");
    order.setState(OrderState.using);
    em.merge(order);
    em.flush();
  }

}
