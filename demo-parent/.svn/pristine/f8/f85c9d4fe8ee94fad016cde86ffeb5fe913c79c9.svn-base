/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2014，所有权利保留。
 * 
 * 项目名：	m3-sales-transport
 * 文件名：	BaseProxyTest.java
 * 模块说明：	
 * 修改历史：
 * 2014年5月4日 - suizhe - 创建。
 */
package com.hd123.demo.rs.proxy;

import java.util.Date;
import java.util.Random;

import org.junit.Before;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.hd123.rumba.commons.biz.entity.BeanOperateContext;
import com.hd123.rumba.commons.biz.entity.OperateContext;
import com.hd123.rumba.commons.biz.entity.Operator;
import com.hd123.rumba.commons.biz.entity.UCN;

/**
 * @author suizhe
 * 
 */
public class BaseProxyTest {

  protected ApplicationContext appCtx;

  protected OperateContext operCtx;

  @Before
  public void setup() throws Exception {
    appCtx = new ClassPathXmlApplicationContext("classpath:main.xml");
    buildOperateContext();
  }

  private OperateContext buildOperateContext() {
    operCtx = new OperateContext();
    operCtx.setTime(new Date());

    Operator operator = new Operator();
    operator.setId("admin");
    operator.setFullName("管理员");

    operCtx.setOperator(operator);

    return operCtx;
  }

  protected BeanOperateContext buildBeanOperateContext() {
    BeanOperateContext operCtx = new BeanOperateContext();
    operCtx.setTime(new Date());

    Operator operator = new Operator();
    operator.setId("admin");
    operator.setFullName("管理员");

    operCtx.setOperator(operator);

    return operCtx;
  }

  protected UCN buildUCN() {
    UCN ucn = new UCN();
    Random rd = new Random();
    ucn.setUuid("uuid" + rd.nextLong());
    ucn.setName("test");
    ucn.setCode("test");
    return ucn;
  }
}
