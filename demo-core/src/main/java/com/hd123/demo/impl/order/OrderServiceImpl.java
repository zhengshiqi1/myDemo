package com.hd123.demo.impl.order;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hd123.demo.impl.order.dao.OrderDao;
import com.hd123.demo.impl.order.dao.POrder;
import com.hd123.demo.impl.util.QueryResultConverter;
import com.hd123.demo.impl.util.ValidatorUtil;
import com.hd123.demo.impl.util.VersionUtil;
import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.demo.service.order.Order;
import com.hd123.demo.service.order.OrderService;
import com.hd123.demo.service.order.OrderState;
import com.hd123.rumba.commons.biz.entity.EntityNotFoundException;
import com.hd123.rumba.commons.biz.entity.OperateContext;
import com.hd123.rumba.commons.biz.entity.VersionConflictException;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;
import com.hd123.rumba.commons.i18n.DefaultStringValue;
import com.hd123.rumba.commons.i18n.Resources;
import com.hd123.rumba.commons.jpa.entity.POperateInfo;
import com.hd123.rumba.commons.lang.ExceptionUtil;

/**
 * 订单业务实现层
 * 
 * @author zhengshiqi
 *
 */
@Service(OrderService.DEFAULT_CONTEXT_ID)
public class OrderServiceImpl implements OrderService {

  @Autowired
  private OrderDao orderDao;

  @Override
  public String save(Order order, OperateContext operCtx) throws DemoServiceException {
    if (order == null) {
      throw ExceptionUtil.nullArgument("order");
    }
    if (operCtx == null) {
      throw ExceptionUtil.nullArgument("operCtx");
    }
    try {
      checkToSave(order);

      POrder pOrder = POrderConverter.getInstance().convert(order);
      if (pOrder.getUuid() == null) {
        pOrder.setCreateInfo(POperateInfo.newInstance(operCtx));
      }
      pOrder.setLastModifyInfo(POperateInfo.newInstance(operCtx));
      return orderDao.save(pOrder);
    } catch (Exception e) {
      throw new DemoServiceException(e);
    }
  }

  @Override
  public QueryResult<Order> query(QueryDefinition definition) {
    QueryResult<POrder> qr = orderDao.query(definition);
    return QueryResultConverter.convert(qr, new OrderConverter());
  }

  @Override
  public Order get(String uuid) {
    POrder order = orderDao.select(uuid);
    return OrderConverter.getInstance().convert(order);
  }

  /**
   * 检查是否允许保存
   * 
   * @param order
   * @throws DemoServiceException
   * @throws VersionConflictException
   */
  private void checkToSave(Order order) throws DemoServiceException, VersionConflictException {
    // 验证资料是否符合约束
    ValidatorUtil.validate(order);

    // 判断代码是否重复
    POrder perz = orderDao.selectByCode(order.getCode());
    if (perz != null && perz.getUuid().equals(order.getUuid()) == false) {
      throw new DemoServiceException(R.R.duplicateCode());
    }

    // 判断版本号是否冲突
    if (perz != null) {
      VersionUtil.checkVersion(order.getVersion(), perz, R.R.caption(), perz.getCode());
    }
  }

  /**
   * 获取指定状态的对象
   * 
   * @param uuid
   *          对象uuid
   * @param version
   *          版本
   * @return 持久化对象
   * @throws DemoServiceException
   * @throws EntityNotFoundException
   * @throws VersionConflictException
   */
  protected POrder safeGet(String uuid, long version) throws DemoServiceException,
      EntityNotFoundException, VersionConflictException {
    POrder perz = orderDao.select(uuid);// 取得最新版本的数据

    // 1、uuid match
    if (perz == null) {
      throw new EntityNotFoundException(R.R.nullObject());
    }

    // 2、version match
    if (version >= 0) {
      VersionUtil.checkVersion(version, perz, R.R.caption(), perz.getCode());
    }
    return perz;
  }

  public interface R {
    public static final R R = Resources.create(R.class);

    @DefaultStringValue("订单")
    String caption();

    @DefaultStringValue("指定的订单不存在。")
    String nullObject();

    @DefaultStringValue("指定代码的订单已存在。")
    String duplicateCode();

    @DefaultStringValue("指定的订单未删除。")
    String undeleteToRemove();
  }

  /**
   * 删除订单（订单状态的修改）
   */
  @Override
  public void delete(String uuid, long version, OperateContext operCtx) throws DemoServiceException {
    if (uuid == null) {
      throw ExceptionUtil.nullArgument("uuid");
    }
    if (operCtx == null) {
      throw ExceptionUtil.nullArgument("operCtx");
    }
    try {
      POrder order = safeGet(uuid, version);
      // 判断是否删除,若已删除直接返回
      if (OrderState.deleted.equals(order.getState())) {
        return;
      }
      order.setLastModifyInfo(POperateInfo.newInstance(operCtx));
      order.setVersionTime(new Date());
      orderDao.delete(order);
    } catch (Exception e) {
      throw new DemoServiceException(e);
    }

  }

  /**
   * 恢复删除
   */
  @Override
  public void undelete(String uuid, long version, OperateContext operCtx)
      throws DemoServiceException {
    if (uuid == null) {
      throw ExceptionUtil.nullArgument("uuid");
    }
    if (operCtx == null) {
      throw ExceptionUtil.nullArgument("operCtx");
    }
    try {
      POrder order = safeGet(uuid, version);
      // 判断是否删除,若已删除直接返回
      if (OrderState.using.equals(order.getState())) {
        return;
      }
      order.setLastModifyInfo(POperateInfo.newInstance(operCtx));
      order.setVersionTime(new Date());
      orderDao.undelete(order);
    } catch (Exception e) {
      throw new DemoServiceException(e);
    }

  }

}
