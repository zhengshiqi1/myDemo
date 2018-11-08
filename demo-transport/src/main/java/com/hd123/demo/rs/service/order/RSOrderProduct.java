package com.hd123.demo.rs.service.order;

import java.math.BigDecimal;

import javax.xml.bind.annotation.XmlRootElement;

import com.hd123.demo.service.order.Order;
import com.hd123.demo.service.product.Product;
import com.hd123.rumba.commons.biz.entity.StandardEntity;

/**
 * 
 * @author zhengshiqi
 *
 */
@XmlRootElement
public class RSOrderProduct extends StandardEntity{

  private static final long serialVersionUID = -4576995864052686687L;
  
  private String code;
  private Order order;
  private BigDecimal buyQty;
  private String remark;
  private Product product;
  
  public String getCode() {
    return code;
  }
  public void setCode(String code) {
    this.code = code;
  }
  public Order getOrder() {
    return order;
  }
  public void setOrder(Order order) {
    this.order = order;
  }
  public BigDecimal getBuyQty() {
    return buyQty;
  }
  public void setBuyQty(BigDecimal buyQty) {
    this.buyQty = buyQty;
  }
  public String getRemark() {
    return remark;
  }
  public void setRemark(String remark) {
    this.remark = remark;
  }
  public Product getProduct() {
    return product;
  }
  public void setProduct(Product product) {
    this.product = product;
  }
 
}
