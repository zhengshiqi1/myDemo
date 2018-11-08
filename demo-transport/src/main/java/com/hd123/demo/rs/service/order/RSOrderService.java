package com.hd123.demo.rs.service.order;

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

import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.rumba.commons.biz.query.BeanQueryDefinition;
import com.hd123.rumba.commons.rs.entity.RSOperateContext;

/**
 * 
 * @author zhengshiqi
 *
 */
@Path("order")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public interface RSOrderService {

  /**
   * 保存订单
   * 
   * @param order
   * @param operCtx
   * @return
   * @throws DemoServiceException
   */
  @POST
  @Path("/save")
  Response save(RSOrder rsOrder, @QueryParam("") RSOperateContext operCtx)
      throws DemoServiceException;

  /**
   * 根据条件查询
   * 
   * @param definition
   * @return
   */
  @POST
  @Path("/query")
  Response query(BeanQueryDefinition definition);

  /**
   * 删除订单
   * 
   * @param uuid
   * @param version
   * @param operCtx
   * @return
   * @throws IllegalArgumentException
   */
  @DELETE
  @Path("/{uuid}/delete")
  Response delete(@PathParam("uuid") String uuid,
      @QueryParam("version") @DefaultValue("-1") long version,
      @QueryParam("") RSOperateContext operCtx) throws IllegalArgumentException;

  /**
   * 恢复删除
   * 
   * @param uuid
   * @param version
   * @param operCtx操作信息
   * @return
   * @throws IllegalArgumentException
   */
  @PUT
  @Path("/undelete/{uuid}")
  Response undelete(@PathParam("uuid") String uuid,
      @QueryParam("version") @DefaultValue("-1") long version,
      @QueryParam("") RSOperateContext operCtx) throws IllegalArgumentException;

  /**
   * 根据UUID查询订单
   * 
   * @param uuid
   * @return
   */
  @GET
  @Path("/{uuid}")
  RSOrder getByUuid(@PathParam("uuid") String uuid);
}
