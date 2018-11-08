package com.hd123.demo.impl.order.dao;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Index;

import com.hd123.demo.impl.base.PUCN;
import com.hd123.demo.service.order.Order;
import com.hd123.demo.service.order.OrderState;
import com.hd123.demo.service.order.OrderType;
import com.hd123.demo.service.product.Product;
import com.hd123.rumba.commons.jpa.entity.PStandardEntity;


/**
 * 订单
 * @author zhengshiqi
 *
 */
@Entity
@Table(name = "zsqDemoOrder")
@org.hibernate.annotations.Table(appliesTo = "zsqDemoOrder", indexes = {
    @Index(name = "idx_zsqDemoOrder_1", columnNames = {
      "code" }) })
public class POrder extends PStandardEntity {
   
  private static final long serialVersionUID = -5223680335974146291L;
  
  private String code;
  private PUCN supplier;
  private Date orderDate;
  private Integer submitExpense;
  private PUCN deliveryMode;
  private OrderType orderType;
  private PUCN address;
  private List<POrderProduct> orderProducts;
  private OrderState state;
  private Double sumPrice;
  private BigDecimal sumQty;
  
  /** 订单编号 */
  @Column(name = "code", length = Order.Schema.LENGTH_CODE)
  public String getCode() {
    return code;
  }
  
  public void setCode(String code) {
    this.code = code;
  }
  
  /** 供应商 */
  @Embedded
  @AttributeOverrides({
      @AttributeOverride(name = "uuid", column = @Column(name = "supplierUuid", length = PUCN.Schema.LENGTH_UUID)),
      @AttributeOverride(name = "code", column = @Column(name = "supplierCode", length = PUCN.Schema.LENGTH_CODE)),
      @AttributeOverride(name = "name", column = @Column(name = "supplierName", length = PUCN.Schema.LENGTH_NAME)) })
  public PUCN getSupplier() {
    return supplier;
  }
  
  public void setSupplier(PUCN supplier) {
    this.supplier = supplier;
  }
  
  /** 订货日期 */
  @Column(name = "orderDate")
  public Date getOrderDate() {
    return orderDate;
  }
  
  public void setOrderDate(Date orderDate) {
    this.orderDate = orderDate;
  }
  
  /** 是否报销 */
  @Column(name = "submitExpense", length =Order.Schema.LENGTH_SUBMITEXPENSE)
  public Integer getSubmitExpense() {
    return submitExpense;
  }
  
  public void setSubmitExpense(Integer submitExpense) {
    this.submitExpense = submitExpense;
  }
  
  /** 送货方式 */
  @Embedded
  @AttributeOverrides({
      @AttributeOverride(name = "uuid", column = @Column(name = "deliveryModeUuid", length = PUCN.Schema.LENGTH_UUID)),
      @AttributeOverride(name = "code", column = @Column(name = "deliveryModeCode", length = PUCN.Schema.LENGTH_CODE)),
      @AttributeOverride(name = "name", column = @Column(name = "deliveryModeName", length = PUCN.Schema.LENGTH_NAME)) })
  public PUCN getDeliveryMode() {
    return deliveryMode;
  }
  
  public void setDeliveryMode(PUCN deliveryMode) {
    this.deliveryMode = deliveryMode;
  }
  
  /** 订单类型 */
  @Enumerated(EnumType.STRING)
  @Column(name = "orderType", length = Order.Schema.LENGTH_ORDERTYPE)
  public OrderType getOrderType() {
    return orderType;
  }
  
  public void setOrderType(OrderType orderType) {
    this.orderType = orderType;
  }
  
  /** 发货库区 */
  @Embedded
  @AttributeOverrides({
      @AttributeOverride(name = "uuid", column = @Column(name = "addressUuid", length = PUCN.Schema.LENGTH_UUID)),
      @AttributeOverride(name = "code", column = @Column(name = "addressCode", length = PUCN.Schema.LENGTH_CODE)),
      @AttributeOverride(name = "name", column = @Column(name = "addressName", length = PUCN.Schema.LENGTH_NAME)) })
  public PUCN getAddress() {
    return address;
  }
  
  public void setAddress(PUCN address) {
    this.address = address;
  }

  /** 订单明细 */
  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "ord")
  public List<POrderProduct> getOrderProducts() {
    return orderProducts;
  }

  public void setOrderProducts(List<POrderProduct> orderProducts) {
    this.orderProducts = orderProducts;
  }
  
  /** 状态 */
  @Enumerated(EnumType.STRING)
  @Column(name = "state", length = Product.Schema.LENGTH_NAME)
  public OrderState getState() {
    return state;
  }

  public void setState(OrderState state) {
    this.state = state;
  }

  /** 销售总金额 */
  @Column(name = "sumPrice",precision = 19, scale = 2)
  public Double getSumPrice() {
    return sumPrice;
  }

  public void setSumPrice(Double sumPrice) {
    this.sumPrice = sumPrice;
  }

  @Column(name = "sumQty", precision = 19, scale = 3)
  public BigDecimal getSumQty() {
    return sumQty;
  }

  public void setSumQty(BigDecimal sumQty) {
    this.sumQty = sumQty;
  }
  
  
  
  


}
