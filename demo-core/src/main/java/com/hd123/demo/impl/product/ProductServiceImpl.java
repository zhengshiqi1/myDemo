/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-core
 * 文件名：	ProductServiceImpl.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.impl.product;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hd123.demo.impl.product.dao.PProduct;
import com.hd123.demo.impl.product.dao.ProductDao;
import com.hd123.demo.impl.util.QueryResultConverter;
import com.hd123.demo.impl.util.ValidatorUtil;
import com.hd123.demo.impl.util.VersionUtil;
import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.demo.service.product.Product;
import com.hd123.demo.service.product.ProductService;
import com.hd123.demo.service.product.ProductState;
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
 * @author liuguilin
 * 
 */
@Service(ProductService.DEFAULT_CONTEXT_ID)
public class ProductServiceImpl implements ProductService {

  @Autowired
  private ProductDao productDao;

  @Override
  public String save(Product product, OperateContext operCtx) throws DemoServiceException {
    if (product == null)
      throw ExceptionUtil.nullArgument("product");
    if (operCtx == null)
      throw ExceptionUtil.nullArgument("operCtx");

    try {
      checkToSave(product);

      PProduct perz = PProductConverter.getInstance().convert(product);
      if (perz.getUuid() == null) {
        perz.setCreateInfo(POperateInfo.newInstance(operCtx));
      }
      perz.setLastModifyInfo(POperateInfo.newInstance(operCtx));

      return productDao.save(perz);
    } catch (Exception e) {
      throw new DemoServiceException(e);
    }
  }

  @Override
  public void delete(String uuid, long version, OperateContext operCtx) throws DemoServiceException {
    if (uuid == null)
      throw ExceptionUtil.nullArgument("uuid");
    if (operCtx == null)
      throw ExceptionUtil.nullArgument("operCtx");
    try {
      PProduct perz = safeGet(uuid, version);
      // 判断是否使用中,若已删除直接返回
      if (ProductState.deleted.equals(perz.getState())) {
        return;
      }

      perz.setLastModifyInfo(POperateInfo.newInstance(operCtx));
      perz.setVersionTime(new Date());
      productDao.delete(perz);
    } catch (Exception e) {
      throw new DemoServiceException(e);
    }
  }

  @Override
  public void remove(String uuid, long version, OperateContext operCtx) throws DemoServiceException {
    if (uuid == null)
      throw ExceptionUtil.nullArgument("uuid");
    if (operCtx == null)
      throw ExceptionUtil.nullArgument("operCtx");
    try {
      PProduct perz = safeGet(uuid, version);
      // 判断是否使用中,若已删除直接返回
      if (ProductState.deleted.equals(perz.getState()) == false) {
        throw new DemoServiceException(R.R.undeleteToRemove());
      }

      productDao.remove(perz);
    } catch (Exception e) {
      throw new DemoServiceException(e);
    }
  }

  @Override
  public void undelete(String uuid, long version, OperateContext operCtx)
      throws DemoServiceException {
    if (uuid == null)
      throw ExceptionUtil.nullArgument("uuid");
    if (operCtx == null)
      throw ExceptionUtil.nullArgument("operCtx");
    try {
      PProduct perz = safeGet(uuid, version);
      // 判断是否使用中,若使用中直接返回
      if (ProductState.using.equals(perz.getState())) {
        return;
      }

      perz.setLastModifyInfo(POperateInfo.newInstance(operCtx));
      perz.setVersionTime(new Date());
      productDao.undelete(perz);
    } catch (Exception e) {
      throw new DemoServiceException(e);
    }
  }

  @Override
  public Product get(String uuid) {
    PProduct product = productDao.get(uuid);
    return new ProductConverter().convert(product);
  }

  @Override
  public Product getByCode(String code) {
    PProduct product = productDao.getByCode(code);
    return new ProductConverter().convert(product);
  }

  @Override
  public QueryResult<Product> query(QueryDefinition definition) {
    QueryResult<PProduct> qr = productDao.query(definition);
    return QueryResultConverter.convert(qr, new ProductConverter());
  }

  /**
   * 检查是否允许保存
   * 
   * @param product
   * @throws DemoServiceException
   * @throws VersionConflictException
   */
  private void checkToSave(Product product) throws DemoServiceException, VersionConflictException {
    // 验证资料是否符合约束
    ValidatorUtil.validate(product);

    // 判断代码是否重复
    PProduct perz = productDao.getByCode(product.getCode());
    if (perz != null && perz.getUuid().equals(product.getUuid()) == false) {
      throw new DemoServiceException(R.R.duplicateCode());
    }

    // 判断版本号是否冲突
    if (perz != null) {
      VersionUtil.checkVersion(product.getVersion(), perz, R.R.caption(), perz.getCode());
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
  protected PProduct safeGet(String uuid, long version) throws DemoServiceException,
      EntityNotFoundException, VersionConflictException {
    PProduct perz = productDao.get(uuid);// 取得最新版本的数据

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

    @DefaultStringValue("商品")
    String caption();

    @DefaultStringValue("指定的商品不存在。")
    String nullObject();

    @DefaultStringValue("指定代码的商品已存在。")
    String duplicateCode();

    @DefaultStringValue("指定的商品未删除。")
    String undeleteToRemove();
  }

}
