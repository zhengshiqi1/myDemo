/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2013，所有权利保留。
 *
 * 项目名：	demo-api
 * 文件名：	DemoServiceException.java
 * 模块说明：
 * 修改历史：
 * 2013-4-8 - zhangyanbo - 创建。
 */
package com.hd123.demo.service.exception;

import java.text.MessageFormat;

/**
 * 访问服务失败。
 *
 * @author liuguilin
 *
 */
public class DemoServiceException extends Exception {
  private static final long serialVersionUID = -7760689677986085359L;

  public DemoServiceException() {
    // Do Nothing
  }

  public DemoServiceException(Throwable caught) {
    super(caught);
  }

  public DemoServiceException(String message) {
    super(message);
  }

  public DemoServiceException(String pattern, Object... arguments) {
    super(MessageFormat.format(pattern, arguments));
  }

  public DemoServiceException(Throwable caught, String pattern, Object... arguments) {
    super(MessageFormat.format(pattern, arguments), caught);
  }
}
