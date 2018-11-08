/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-api
 * 文件名：	Product.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-24 - huangjunxian- 创建。
 */
package com.hd123.demo.service.product;

import java.math.BigDecimal;

import javax.xml.bind.annotation.XmlRootElement;

import com.hd123.rumba.commons.biz.entity.StandardEntity;
import com.hd123.rumba.commons.biz.entity.UCN;
import com.hd123.rumba.commons.biz.validator.Length;
import com.hd123.rumba.commons.biz.validator.Min;
import com.hd123.rumba.commons.biz.validator.NotNull;

/**
 * 商品
 * 
 * @author huangjunxian
 * 
 */
@XmlRootElement
public class Product extends StandardEntity {
  private static final long serialVersionUID = -7811918026039254438L;

  private String code;
  private String name;
  private BigDecimal qty;
  private ProductState state;
  private UCN bank;
  private String remark;
  private Double price;

  /** 代码 */
  @NotNull
  @Length(max = Product.Schema.LENGTH_CODE)
  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  /** 名称 */
  @NotNull
  @Length(max = Product.Schema.LENGTH_NAME)
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  /** 数量 */
  @Min(0)
  public BigDecimal getQty() {
    return qty;
  }

  public void setQty(BigDecimal qty) {
    this.qty = qty;
  }

  /** 状态 */
  public ProductState getState() {
    return state;
  }

  public void setState(ProductState state) {
    this.state = state;
  }

  /** 供应商 */
  public UCN getBank() {
    return bank;
  }

  public void setBank(UCN bank) {
    this.bank = bank;
  }

  /** 说明 */
  @Length(max = Product.Schema.LENGTH_REMARK)
  public String getRemark() {
    return remark;
  }

  public void setRemark(String remark) {
    this.remark = remark;
  }
  
  /** 价格 */
  public Double getPrice() {
    return price;
  }

  public void setPrice(Double price) {
    this.price = price;
  }



  /**
   * {@link Product}对应数据表结构相关常量定义。
   * 
   * @author 陈日漳
   * @since 1.8
   * 
   */
  public static class Schema {
    /** 代码长度，单位字节，对应属性{@link Product#getCode()}。 */
    public static final int LENGTH_CODE = 32;
    /** 名称长度，单位字符，对应属性{@link Product#getName()}。 */
    public static final int LENGTH_NAME = 64;
    /** 状态长度，单位字符，对应属性{@link Product#getState()}。 */
    public static final int LENGTH_STATE = 20;
    /** 说明长度，单位字符，对应属性{@link Product#getRemark()}。 */
    public static final int LENGTH_REMARK = 128;
  }

}
