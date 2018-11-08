/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2013，所有权利保留。
 * 
 * 项目名：	demo-core
 * 文件名：	BasicDaoImpl.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.impl.base.dao;

import java.text.MessageFormat;

import javax.persistence.EntityManager;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanNotOfRequiredTypeException;
import org.springframework.beans.factory.NoSuchBeanDefinitionException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.rumba.commons.i18n.DefaultStringValue;
import com.hd123.rumba.commons.i18n.Resources;

/**
 * 基础的DaoImpl
 * 
 * @author liuguilin
 * 
 */
public class BasicDaoImpl implements ApplicationContextAware {

  protected ApplicationContext appCtx;

  @Override
  public void setApplicationContext(ApplicationContext appCtx) throws BeansException {
    this.appCtx = appCtx;
  }

  protected <T> T getBean(Class<T> beanClass) throws IllegalStateException {
    try {
      return appCtx.getBean(beanClass);
    } catch (NoSuchBeanDefinitionException e) {
      throw new IllegalStateException(MessageFormat.format(R_Basic.R.beanNotExist(),
          beanClass.getName()));
    } catch (BeanNotOfRequiredTypeException e) {
      throw new IllegalStateException(MessageFormat.format(R_Basic.R.beanNotInstanceOf(),
          beanClass.getName(), beanClass.getName()));
    }
  }

  protected <T> T getBean(String beanId, Class<T> beanClass) throws IllegalStateException {
    try {
      return appCtx.getBean(beanId, beanClass);
    } catch (NoSuchBeanDefinitionException e) {
      throw new IllegalStateException(MessageFormat.format(R_Basic.R.beanNotExist(),
          beanClass.getName()));
    } catch (BeanNotOfRequiredTypeException e) {
      throw new IllegalStateException(MessageFormat.format(R_Basic.R.beanNotInstanceOf(),
          beanClass.getName(), beanClass.getName()));
    }
  }

  protected void verifyPoJo(EntityManager em, Object object) throws DemoServiceException {
    if (em.contains(object)) {
      throw new DemoServiceException(R_Basic.R.requirePojo());
    }
  }

  public interface R_Basic {

    public static final R_Basic R = Resources.create(R_Basic.class);

    @DefaultStringValue("找不到“{0}”对应的bean。")
    String beanNotExist();

    @DefaultStringValue("“{0}”对应的bean不是“{1}”的实例。")
    String beanNotInstanceOf();

    @DefaultStringValue("指定的参数object必须是一个POJO。")
    String requirePojo();
  }
}
