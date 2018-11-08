/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-core
 * 文件名：	AbstractTest.java
 * 模块说明：	
 * 修改历史：
 * 2015-5-25 - qyh - 创建。
 */
package com.hd123.demo.impl;

import static org.junit.Assert.fail;

import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;

import org.apache.commons.lang3.time.DateUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.hd123.demo.service.product.ProductService;
import com.hd123.rumba.commons.biz.entity.OperateContext;
import com.hd123.rumba.commons.biz.entity.Operator;

/**
 * @author qyh
 * 
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration({
  "classpath:demo-test.xml" })
public abstract class AbstractTest {

  @Autowired
  protected ApplicationContext appCtx;

  protected ProductService productService;

  protected Logger logger = LoggerFactory.getLogger(this.getClass());

  @Before
  public void setup() throws Exception {
    productService = appCtx.getBean(ProductService.class);
  }

  @After
  public void teardown() throws Exception {
  }

  protected OperateContext getOperCtx() {
    OperateContext c = new OperateContext();
    c.setOperator(new Operator("unittest", "单元测试"));
    return c;
  }

  protected long nextId() {
    return sequencer.addAndGet(1L);
  }

  protected Date today() {
    return DateUtils.truncate(new Date(), Calendar.DATE);
  }

  public void unreachable() {
    fail("不会执行到这里");
  }

  public int randomIndex(int min, int max) {
    return (int) (Math.random() * (max - min)) + min;
  }

  protected static AtomicLong sequencer = new AtomicLong(10000);
}
