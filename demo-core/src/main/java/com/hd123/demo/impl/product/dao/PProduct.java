/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-core
 * 文件名：	PProduct.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.impl.product.dao;

import java.math.BigDecimal;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;

import org.hibernate.annotations.Index;

import com.hd123.demo.impl.base.PUCN;
import com.hd123.demo.service.product.Product;
import com.hd123.demo.service.product.ProductState;
import com.hd123.rumba.commons.biz.entity.HasUCN;
import com.hd123.rumba.commons.jpa.entity.PStandardEntity;

/**
 * @author liuguilin
 * 
 */
@Embeddable
@Entity
@Table(name = "zsqDemoProduct")
@org.hibernate.annotations.Table(appliesTo = "zsqDemoProduct", indexes = {
  @Index(name = "idx_zsqDemoProduct_1", columnNames = {
    "code" }) })
public class PProduct extends PStandardEntity implements HasUCN {

  private static final long serialVersionUID = -3266221348032666351L;
  private String code;
  private String name;
  private BigDecimal qty;
  private ProductState state;
  private PUCN bank;
  private String remark;
  private Double price;

  /** 代码 */
  @Column(name = "code", length = Product.Schema.LENGTH_CODE, nullable = false)
  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  /** 名称 */
  @Column(name = "name", length = Product.Schema.LENGTH_NAME, nullable = false)
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  /** 数量 */
  @Column(name = "qty", precision = 19, scale = 3)
  public BigDecimal getQty() {
    return qty;
  }

  public void setQty(BigDecimal qty) {
    this.qty = qty;
  }

  /** 状态 */
  @Enumerated(EnumType.STRING)
  @Column(name = "state", length = Product.Schema.LENGTH_NAME)
  public ProductState getState() {
    return state;
  }

  public void setState(ProductState state) {
    this.state = state;
  }

  /** 银行 */
  @Embedded
  @AttributeOverrides({
      @AttributeOverride(name = "uuid", column = @Column(name = "bankUuid", length = PUCN.Schema.LENGTH_UUID)),
      @AttributeOverride(name = "code", column = @Column(name = "bankCode", length = PUCN.Schema.LENGTH_CODE)),
      @AttributeOverride(name = "name", column = @Column(name = "bankName", length = PUCN.Schema.LENGTH_NAME)) })
  public PUCN getBank() {
    return bank;
  }

  public void setBank(PUCN bank) {
    this.bank = bank;
  }

  /** 说明 */
  @Column(name = "remark", length = Product.Schema.LENGTH_REMARK)
  public String getRemark() {
    return remark;
  }

  public void setRemark(String remark) {
    this.remark = remark;
  }

  /** 价格 */
  @Column(name = "price",precision = 19, scale = 2)
  public Double getPrice() {
    return price;
  }

  public void setPrice(Double price) {
    this.price = price;
  }
  
  

}
