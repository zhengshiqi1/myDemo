package com.hd123.demo.service.orderproduct;

import java.math.BigDecimal;

import com.hd123.demo.service.product.Product;
import com.hd123.rumba.commons.biz.entity.StandardEntity;
import com.hd123.rumba.commons.biz.validator.Length;
import com.hd123.rumba.commons.biz.validator.Min;

/**
 * 
 * @Description 订单明细
 * @author zhengshiqi
 *
 */
public class OrderProduct extends StandardEntity{
  
  private static final long serialVersionUID = 811969652012881455L;
  
  private Product product;
  private BigDecimal buyQty;
  private String remark;
  private Double allPrice;
  

  public Product getProduct() {
    return product;
  }

  public void setProduct(Product product) {
    this.product = product;
  }

  /** 购买数量 */
  @Min(0)
  public BigDecimal getBuyQty() {
    return buyQty;
  }
  
  public void setBuyQty(BigDecimal buyQty) {
    this.buyQty = buyQty;
  }
  
  /** 说明 */
  @Length(max = OrderProduct.Schema.LENGTH_REMARK)
  public String getRemark() {
    return remark;
  }
  public void setRemark(String remark) {
    this.remark = remark;
  }
  
  /** 价格*/
  public Double getAllPrice() {
    return allPrice;
  }

  public void setAllPrice(Double allPrice) {
    this.allPrice = allPrice;
  }


  public static class Schema {
    /** 说明长度，单位字符，对应属性{@link OrderProduct#getRemark()}。 */
    public static final int LENGTH_REMARK = 2048;
  }

}
