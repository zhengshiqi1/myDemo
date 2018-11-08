/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-transport
 * 文件名：	RSProductService.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-24 - huangjunxian- 创建。
 */
package com.hd123.demo.rs.service.product;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.hd123.rumba.commons.biz.query.BeanQueryDefinition;
import com.hd123.rumba.commons.rs.entity.RSOperateContext;

/**
 * 商品传输层服务|接口
 * 
 * @author huangjunxian
 * 
 */
@Path("product")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface RSProductService {

  /**
   * 保存商品。
   * 
   * @param product
   *          商品， not null。
   * @param operCtx
   *          操作信息，not null。
   * @return 商品uuid。
   * @throws IllegalArgumentException
   */
  @POST
  @Path("/save")
  Response save(RSProduct product, @QueryParam("") RSOperateContext operCtx)
      throws IllegalArgumentException;

  /**
   * 删除商品。
   * 
   * @param uuid
   *          商品uuid， not null。
   * @param version
   *          版本号。
   * @param operCtx
   *          操作信息，not null。
   * @throws IllegalArgumentException
   */
  @DELETE
  @Path("/{uuid}/delete")
  Response delete(@PathParam("uuid") String uuid,
      @QueryParam("version") @DefaultValue("-1") long version,
      @QueryParam("") RSOperateContext operCtx) throws IllegalArgumentException;

  /**
   * 删除商品。
   * 
   * @param uuid
   *          商品uuid， not null。
   * @param version
   *          版本号。
   * @param operCtx
   *          操作信息，not null。
   * @throws IllegalArgumentException
   */
  @DELETE
  @Path("/{uuid}/remove")
  Response remove(@PathParam("uuid") String uuid,
      @QueryParam("version") @DefaultValue("-1") long version,
      @QueryParam("") RSOperateContext operCtx) throws IllegalArgumentException;

  /**
   * 恢复删除商品。
   * 
   * @param uuid
   *          商品uuid,not null。
   * @param version
   *          版本号。
   * @param operCtx
   *          操作信息，not null。
   * @throws IllegalArgumentException
   */
  @PUT
  @Path("/undelete/{uuid}")
  Response undelete(@PathParam("uuid") String uuid,
      @QueryParam("version") @DefaultValue("-1") long version,
      @QueryParam("") RSOperateContext operCtx) throws IllegalArgumentException;

  /**
   * 根据uuid获取商品。
   * 
   * @param uuid
   *          商品uuid,not null。
   * @return 商品对象。
   */
  @GET
  @Path("/{uuid}")
  RSProduct get(@PathParam("uuid") String uuid);

  /**
   * 根据代码获取商品。
   * 
   * @param code
   *          商品商品,not null。
   * @return 商品对象。
   */
  @GET
  @Path("/get_by_code/{code}")
  RSProduct getByCode(@PathParam("code") String code);

  /**
   * 查询商品。
   * 
   * @param queryDefinition
   *          查询定义，not null。
   * @return 商品分页信息。
   */
  @POST
  @Path("/query")
  Response query(BeanQueryDefinition queryDefinition);
}
