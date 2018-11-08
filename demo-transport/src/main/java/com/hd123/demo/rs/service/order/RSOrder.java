package com.hd123.demo.rs.service.order;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import com.hd123.demo.service.orderproduct.OrderProduct;
import com.hd123.rumba.commons.biz.entity.StandardEntity;
import com.hd123.rumba.commons.biz.entity.UCN;

/**
 * 
 * @author zhengshiqi
 *
 */
@XmlRootElement
public class RSOrder extends StandardEntity {

  private static final long serialVersionUID = -2460335434121906843L;
  
  private String code;
  private UCN supplier;
  private Date orderDate;
  private Integer submitExpense;
  private UCN deliveryMode;
  private String orderType;
  private UCN address;
  private List<OrderProduct> orderProducts = new ArrayList<OrderProduct>();
  private String state;
  private Double sumPrice;
  private BigDecimal sumQty;
  public String getCode() {
    return code;
  }
  public void setCode(String code) {
    this.code = code;
  }
  public UCN getSupplier() {
    return supplier;
  }
  public void setSupplier(UCN supplier) {
    this.supplier = supplier;
  }
  public Date getOrderDate() {
    return orderDate;
  }
  public void setOrderDate(Date orderDate) {
    this.orderDate = orderDate;
  }
  public Integer getSubmitExpense() {
    return submitExpense;
  }
  public void setSubmitExpense(Integer submitExpense) {
    this.submitExpense = submitExpense;
  }
  public UCN getDeliveryMode() {
    return deliveryMode;
  }
  public void setDeliveryMode(UCN deliveryMode) {
    this.deliveryMode = deliveryMode;
  }
  public String getOrderType() {
    return orderType;
  }
  public void setOrderType(String orderType) {
    this.orderType = orderType;
  }
  public UCN getAddress() {
    return address;
  }
  public void setAddress(UCN address) {
    this.address = address;
  }
  public List<OrderProduct> getOrderProducts() {
    return orderProducts;
  }
  public void setOrderProducts(List<OrderProduct> orderProducts) {
    this.orderProducts = orderProducts;
  }
  public String getState() {
    return state;
  }
  public void setState(String state) {
    this.state = state;
  }
  public Double getSumPrice() {
    return sumPrice;
  }
  public void setSumPrice(Double sumPrice) {
    this.sumPrice = sumPrice;
  }
  public BigDecimal getSumQty() {
    return sumQty;
  }
  public void setSumQty(BigDecimal sumQty) {
    this.sumQty = sumQty;
  }
  

}
