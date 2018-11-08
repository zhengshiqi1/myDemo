package com.hd123.demo.service.order;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.hd123.demo.service.orderproduct.OrderProduct;
import com.hd123.demo.service.product.Product;
import com.hd123.rumba.commons.biz.entity.StandardEntity;
import com.hd123.rumba.commons.biz.entity.UCN;
import com.hd123.rumba.commons.biz.validator.Length;
import com.hd123.rumba.commons.biz.validator.Min;
import com.hd123.rumba.commons.biz.validator.NotNull;

/**
 * 
 * @Description 订单
 * @author zhengshiqi
 */
public class Order extends StandardEntity {

  private static final long serialVersionUID = 4124945464145337616L;

  private String code;
  private UCN supplier;
  private Date orderDate;
  private Integer submitExpense;
  private UCN deliveryMode;
  private OrderType orderType;
  private UCN address;
  private List<OrderProduct> orderProducts = new ArrayList<OrderProduct>();
  private OrderState state;
  private Double sumPrice;
  private BigDecimal sumQty;

  /** 订单编号 */
  @NotNull
  @Length(max = Product.Schema.LENGTH_CODE)
  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  /** 供应商 */
  @NotNull
  public UCN getSupplier() {
    return supplier;
  }

  public void setSupplier(UCN supplier) {
    this.supplier = supplier;
  }

  /** 订货日期 */
  @NotNull
  public Date getOrderDate() {
    return orderDate;
  }

  public void setOrderDate(Date orderDate) {
    this.orderDate = orderDate;
  }

  /** 是否报销 （0,1） */
  @NotNull
  public Integer getSubmitExpense() {
    return submitExpense;
  }

  public void setSubmitExpense(Integer submitExpense) {
    this.submitExpense = submitExpense;
  }

  /** 送货方式 */
  public UCN getDeliveryMode() {
    return deliveryMode;
  }

  public void setDeliveryMode(UCN deliveryMode) {
    this.deliveryMode = deliveryMode;
  }

  /** 订单类型（衣 食 住 行） */
  public OrderType getOrderType() {
    return orderType;
  }

  public void setOrderType(OrderType orderType) {
    this.orderType = orderType;
  }

  /** 发货库区 */
  public UCN getAddress() {
    return address;
  }

  public void setAddress(UCN address) {
    this.address = address;
  }

  /** 订单明细 */
  public List<OrderProduct> getOrderProducts() {
    return orderProducts;
  }

  public void setOrderProducts(List<OrderProduct> orderProducts) {
    this.orderProducts = orderProducts;
  }

  /** 订单状态 */
  public OrderState getState() {
    return state;
  }

  public void setState(OrderState state) {
    this.state = state;
  }

  /** 销售总金额 */
  public Double getSumPrice() {
    return sumPrice;
  }

  public void setSumPrice(Double sumPrice) {
    this.sumPrice = sumPrice;
  }

  @Min(0)
  public BigDecimal getSumQty() {
    return sumQty;
  }

  public void setSumQty(BigDecimal sumQty) {
    this.sumQty = sumQty;
  }

  public static class Schema {
    /** 代码长度，单位字节，对应属性{@link Order#getCode()}。 */
    public static final int LENGTH_CODE = 32;
    /** 名称长度，单位字符，对应属性{@link Order#getDeliveryMode()}。 */
    public static final int LENGTH_DELIVERYMODE = 50;
    /** 状态长度，单位字符，对应属性{@link Order#getOrderType()}。 */
    public static final int LENGTH_ORDERTYPE = 20;
    /** 状态长度，单位字符，对应属性{@link Order#getSubmitExpense()}。 */
    public static final int LENGTH_SUBMITEXPENSE = 1;
  }

}
