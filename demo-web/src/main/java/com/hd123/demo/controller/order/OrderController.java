package com.hd123.demo.controller.order;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.hd123.demo.controller.ModuleController;
import com.hd123.demo.query.QueryFilter;
import com.hd123.demo.query.SummaryQueryResult;
import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.demo.service.order.Order;
import com.hd123.demo.service.order.OrderService;
import com.hd123.rumba.commons.biz.entity.OperateContext;
import com.hd123.rumba.commons.biz.entity.UCN;
import com.hd123.rumba.commons.biz.query.QueryDefinition;
import com.hd123.rumba.commons.biz.query.QueryResult;

/**
 * 
 * @author zhengshiqi
 *
 */
@Controller
@RequestMapping("order/*")
public class OrderController extends ModuleController {
  
  @Autowired
  private OrderService orderService;
  
  @Autowired
  private OrderQueryBuilder queryBuilder;
  
  /**供应商*/
  private static List<UCN> suppliers = new ArrayList<UCN>();
  static {
    suppliers.add(new UCN("0001", "0001", "1号供应商"));
    suppliers.add(new UCN("0002", "0002", "2号供应商"));
    suppliers.add(new UCN("0003", "0003", "3号供应商"));
    suppliers.add(new UCN("0004", "0004", "4号供应商"));
    suppliers.add(new UCN("0005", "0005", "5号供应商"));
  }
  /**发货库区*/
  private static List<UCN> address = new ArrayList<UCN>();
  static{
    address.add(new UCN("0001","0001","1号货区"));
    address.add(new UCN("0002","0002","2号货区"));
    address.add(new UCN("0003","0003","3号货区"));
    address.add(new UCN("0004","0004","4号货区"));
    address.add(new UCN("0005","0005","5号货区"));
  }
  /** 送货方式 */
  private static List<UCN> deliveryModes = new ArrayList<UCN>();
  static{
    deliveryModes.add(new UCN("0001","0001","1号方式"));
    deliveryModes.add(new UCN("0002","0002","2号方式"));
    deliveryModes.add(new UCN("0003","0003","3号方式"));
    deliveryModes.add(new UCN("0004","0004","4号方式"));
    deliveryModes.add(new UCN("0005","0005","5号方式"));
  }
  
  
  /**
   * 保存订单
   * @param order
   * @return
   * @throws DemoServiceException
   */
  @RequestMapping(value = "save")
  public @ResponseBody Order save(@RequestBody Order order) throws DemoServiceException {
    if (order == null) {
      return null;
    }
    if (order.getUuid()==null) {
      String code = String.valueOf(System.currentTimeMillis());
      order.setCode(code);
    }
    String uuid = orderService.save(order, new OperateContext(getSessionUser()));
    return get(uuid);
  }
  
  /**
   * 根据UUID查询订单
   * @param uuid
   * @return
   */
  @RequestMapping(value = "get",method=RequestMethod.GET)
  public @ResponseBody Order get(String uuid){
    Order order =orderService.get(uuid);
    return order;
  }
  
  
  /**
   * 删除订单
   * @param order
   * @throws Exception
   */
  @RequestMapping(value = "delete")
  @ResponseStatus(HttpStatus.OK)
  public void delete(@RequestBody Order order) throws Exception {
    orderService.delete(order.getUuid(), order.getVersion(), new OperateContext(
        getSessionUser()));
  }

  /**
   * 恢复删除
   * @param order
   * @throws Exception
   */
  @RequestMapping(value = "undelete")
  @ResponseStatus(HttpStatus.OK)
  public void undelete(@RequestBody Order order) throws Exception {
    orderService.undelete(order.getUuid(), order.getVersion(), new OperateContext(
        getSessionUser()));
  }
  
  /**
   * 条件查询
   * @param queryFilter
   * @return
   */
  @RequestMapping("query")
  public @ResponseBody SummaryQueryResult query(@RequestBody QueryFilter queryFilter) {
    if (queryFilter == null) {
      return new SummaryQueryResult();
    }
    QueryDefinition queryDef = queryBuilder.build(queryFilter);
    QueryResult<Order> ordeResult = orderService.query(queryDef);
    SummaryQueryResult result = SummaryQueryResult.newInstance(ordeResult);
    buildSummary(result, queryFilter);
    return result;
  }
  
  /**
   * 查询发货库区
   * @param keyword
   * @return
   * @throws Exception
   */
  @RequestMapping(value = "queryAddress", method = RequestMethod.POST)
  public @ResponseBody List<UCN> queryAddress(
      @RequestParam(value = "keyword", required = false) String keyword) throws Exception {
    List<UCN> result = new ArrayList<UCN>();
    for (UCN addr : address) {
      if (keyword != null) {
        if (addr.getName().contains(keyword) == false && addr.getCode().contains(keyword)){
          continue;
        }
      }
      result.add(addr);
    }

    return result;
  }
  
  /**
   * 查询供应商
   * @param keyword
   * @return
   * @throws Exception
   */
  @RequestMapping(value = "querySuppliers", method = RequestMethod.POST)
  public @ResponseBody List<UCN> querySuppliers(
      @RequestParam(value = "keyword", required = false) String keyword) throws Exception {
    List<UCN> result = new ArrayList<UCN>();
    for (UCN supplier : suppliers) {
      if (keyword != null) {
        if (supplier.getName().contains(keyword) == false && supplier.getCode().contains(keyword)==false) {
          continue;
        }
        
      }
      result.add(supplier);
    }

    return result;
  }
  
  /**
   * 查询送货方式
   * @param keyword
   * @return
   * @throws Exception
   */
  @RequestMapping(value = "queryDeliveryModes", method = RequestMethod.POST)
  public @ResponseBody List<UCN> queryDeliveryModes(
      @RequestParam(value = "keyword", required = false) String keyword) throws Exception {
    List<UCN> result = new ArrayList<UCN>();
    for (UCN deliveryMode : deliveryModes) {
      if (keyword != null) {
        if (deliveryMode.getName().contains(keyword) == false) {
          continue;
        }
      }
      result.add(deliveryMode);
    }

    return result;
  }
  
  /**
   * 搜索页面状态显示数字
   * 
   * @param result
   * @param queryFilter
   */
  private void buildSummary(SummaryQueryResult result, QueryFilter queryFilter) {
    queryFilter.setPage(1);
    // 查询全部
    queryFilter.getFilter().put("state", null);
    QueryDefinition queryDef = queryBuilder.build(queryFilter);
    result.getSummary().put("all", orderService.query(queryDef).getRecordCount());
    // 使用中
    queryFilter.getFilter().put("state", "using");
    queryDef = queryBuilder.build(queryFilter);
    result.getSummary().put("using", orderService.query(queryDef).getRecordCount());
    // 已停用
    queryFilter.getFilter().put("state", "deleted");
    queryDef = queryBuilder.build(queryFilter);
    result.getSummary().put("deleted", orderService.query(queryDef).getRecordCount());
  }
  
}
