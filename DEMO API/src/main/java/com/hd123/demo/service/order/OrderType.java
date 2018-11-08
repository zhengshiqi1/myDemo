package com.hd123.demo.service.order;

/**
 * 订单类型
 * @author zhengshiqi
 *
 */
public enum OrderType {
  yi("衣"), shi("食"),zhu("住"),xing("行");
  
  private String ordType;

  private OrderType(String ordType) {
    this.ordType = ordType;
  }

  public String getCaption() {
    return ordType;
  }

}
