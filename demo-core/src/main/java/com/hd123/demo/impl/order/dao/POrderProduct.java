package com.hd123.demo.impl.order.dao;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Index;

import com.hd123.demo.impl.product.dao.PProduct;
import com.hd123.demo.service.orderproduct.OrderProduct;
import com.hd123.rumba.commons.jpa.entity.PStandardEntity;

/**
 * 订单明细
 * @author zhengshiqi
 *
 */
@Entity
@Table(name = "zsqDemoOrderProduct")
@org.hibernate.annotations.Table(appliesTo = "zsqDemoOrderProduct", indexes = {
    @Index(name = "idx_zsqDemoOrderProduct_1", columnNames = {
      "ord" }) })
public class POrderProduct extends PStandardEntity{
  
  private static final long serialVersionUID = 4537548301162671699L;
  
  private POrder ord;
  private BigDecimal buyQty;
  private String remark;
  private PProduct product;
  private Double allPrice;
  
  /** 订单 */
  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "ord", nullable = false)
  public POrder getOrd() {
    return ord;
  }

  public void setOrd(POrder ord) {
    this.ord = ord;
  }
  
  /** 商品 */
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name="product",nullable = false)
  public PProduct getProduct() {
    return product;
  }

  public void setProduct(PProduct product) {
    this.product = product;
  }
  
  /** 购买数量 */
  @Column(name = "buyQty", precision = 19, scale = 3)
  public BigDecimal getBuyQty() {
    return buyQty;
  }
  
  public void setBuyQty(BigDecimal buyQty) {
    this.buyQty = buyQty;
  }
  
  /** 说明 */
  @Column(name = "remark", length = OrderProduct.Schema.LENGTH_REMARK)
  public String getRemark() {
    return remark;
  }
  public void setRemark(String remark) {
    this.remark = remark;
  }

  /** 价格 */
  @Column(name = "allPrice",precision = 19, scale = 2)
  public Double getAllPrice() {
    return allPrice;
  }

  public void setAllPrice(Double allPrice) {
    this.allPrice = allPrice;
  }
  
  
  
  

}
