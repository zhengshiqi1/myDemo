package com.hd123.demo.service.order;

/**
 * 订单状态
 * @author zhengshiqi
 *
 */
public enum OrderState {
  using("使用中"), deleted("已删除");

  private String caption;

  private OrderState(String caption) {
    this.caption = caption;
  }

  public String getCaption() {
    return caption;
  }
}
