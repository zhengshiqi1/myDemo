/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-transport
 * 文件名：	RSProduct.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.rs.service.product;

import java.math.BigDecimal;

import javax.xml.bind.annotation.XmlRootElement;

import com.hd123.rumba.commons.biz.entity.StandardEntity;
import com.hd123.rumba.commons.biz.entity.UCN;

/**
 * @author liuguilin
 * 
 */
@XmlRootElement
public class RSProduct extends StandardEntity {

  private static final long serialVersionUID = 6737579579599261961L;

  private String code;
  private String name;
  private BigDecimal qty;
  private String state;
  private UCN bank;
  private String remark;
  private Double price;

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public BigDecimal getQty() {
    return qty;
  }

  public void setQty(BigDecimal qty) {
    this.qty = qty;
  }

  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public UCN getBank() {
    return bank;
  }

  public void setBank(UCN bank) {
    this.bank = bank;
  }

  public String getRemark() {
    return remark;
  }

  public void setRemark(String remark) {
    this.remark = remark;
  }

  public Double getPrice() {
    return price;
  }

  public void setPrice(Double price) {
    this.price = price;
  }
  
  

}
