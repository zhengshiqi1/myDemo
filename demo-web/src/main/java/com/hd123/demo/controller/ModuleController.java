/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2016，所有权利保留。
 * 
 * 项目名：	demo-web
 * 文件名：	ModuleController.java
 * 模块说明：	
 * 修改历史：
 * 2016年11月26日 - cRazy - 创建。
 */
package com.hd123.demo.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ServletContextAware;

import com.hd123.rumba.commons.biz.entity.IsOperator;
import com.hd123.rumba.webframe.session.Session;

/**
 * @author cRazy
 *
 */
public class ModuleController implements ApplicationContextAware, ServletContextAware {

  protected static final Logger LOGGER = LoggerFactory.getLogger(ModuleController.class);

  private static final String KEY_USER = "currentUser";

  /**
   * 加载模块上下文
   * 
   * @return Map<String,Object>
   */
  @RequestMapping(value = "moduleContext", method = RequestMethod.GET)
  public @ResponseBody Map<String, Object> getModuleContext() {
    Map<String, Object> moduleContext = new HashMap<String, Object>();
    buildModuleContext(moduleContext);
    return moduleContext;
  }

  /** 构建模块操作上下文 */
  protected void buildModuleContext(Map<String, Object> moduleContext) {
    moduleContext.put(KEY_USER, getSessionUser());
  }

  /** 获取当前用户 */
  protected IsOperator getSessionUser() {
    Session session = Session.getInstance();
    return session != null ? session.getCurrentUser() : null;
  }

  /** 当前用户ID */
  protected String getSessionUserId() {
    IsOperator user = getSessionUser();
    return user != null ? user.getId() : null;
  }

  protected ApplicationContext getAppCtx() {
    return appCtx;
  }

  @Override
  public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
    this.appCtx = applicationContext;
  }

  public ServletContext getServletContext() {
    return servletContext;
  }

  @Override
  public void setServletContext(ServletContext servletContext) {
    this.servletContext = servletContext;
  }

  private ApplicationContext appCtx;
  private ServletContext servletContext;

}
