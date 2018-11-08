/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2013，所有权利保留。
 *
 * 项目名：	demo-rest
 * 文件名：	ExceptionResponseBuilder.java
 * 模块说明：
 * 修改历史：
 * 2013-6-21 - Cogito - 创建。
 */
package com.hd123.demo.rs.server.util;

import javax.ws.rs.core.Response;

import com.hd123.rumba.commons.biz.entity.EntityNotFoundException;
import com.hd123.rumba.commons.biz.entity.VersionConflictException;

/**
 * @author Cogito
 *
 */
public class ExceptionResponseBuilder {

  /**
   * 根据异常构造返回信息。
   *
   * <table border=1 cellpadding=5>
   * <tr>
   * <th>异常</th>
   * <th>返回状态码</th>
   * </tr>
   *
   * <tr>
   * <td>null</td>
   * <td>200</td>
   * </tr>
   *
   * <tr>
   * <td>IllegalArgumentException</td>
   * <td>400</td>
   * </tr>
   *
   * <tr>
   * <td>EntityNotFoundException</td>
   * <td>404</td>
   * </tr>
   *
   * <tr>
   * <td>VersionConflictException</td>
   * <td>409</td>
   * </tr>
   *
   * <tr>
   * <td>IllegalStateException</td>
   * <td>409</td>
   * </tr>
   *
   * <tr>
   * <td>其他</td>
   * <td>500</td>
   * </tr>
   *
   * </table>
   *
   * @param e
   *          异常。为null时，直接返回正常。
   * @return 返回信息。
   */
  public static Response build(Exception e) {
    if (e == null)
      return Response.ok().build();

    if (e instanceof IllegalArgumentException) {
      return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();
    } else if (e instanceof EntityNotFoundException) {
      return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();
    } else if (e instanceof VersionConflictException) {
      return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
    } else if (e instanceof IllegalStateException) {
      return Response.status(Response.Status.CONFLICT).entity(e.getMessage()).build();
    }

    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(e.getMessage()).build();
  }
}
