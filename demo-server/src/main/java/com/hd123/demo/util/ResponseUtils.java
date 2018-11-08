/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2013，所有权利保留。
 * 
 * 项目名：	demo-rest
 * 文件名：	ResponseUtils.java
 * 模块说明：	
 * 修改历史：
 * 2013-11-20 - wulei - 创建。
 */
package com.hd123.demo.util;

import java.util.List;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import com.hd123.rumba.commons.biz.validator.ConstraintViolation;
import com.hd123.rumba.commons.lang.Assert;

/**
 * 与Http响应相关的工具
 * 
 * @author wulei
 * 
 */
public class ResponseUtils {
  /**
   * 构造400 BAD REQUEST响应。
   * 
   * @param violations
   *          请求错误列表
   * @param message
   *          错误信息
   * @return 异常。
   */
  public static WebApplicationException badRequest(List<ConstraintViolation> violations) {
    StringBuffer sb = new StringBuffer();
    if (violations != null) {
      for (ConstraintViolation cv : violations) {
        sb.append(cv.getPropertyName()).append(cv.getMessage()).append("\r\n");
      }
    }
    return buildException(Response.Status.BAD_REQUEST, sb.toString());
  }

  /**
   * 构造WebApplicationException异常。
   * 
   * @param status
   *          状态码，not null
   * @param message
   *          错误信息
   * @return 异常。
   */
  public static WebApplicationException buildException(Response.Status status, String message) {
    Assert.assertArgumentNotNull(status, "status");

    return new WebApplicationException(Response.status(status).entity(message).build());
  }
}
