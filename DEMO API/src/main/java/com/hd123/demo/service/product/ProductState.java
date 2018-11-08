/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-api
 * 文件名：	ProductState.java
 * 模块说明：	
 * 修改历史：
 * 2015年8月10日 - chenrizhang - 创建。
 */
package com.hd123.demo.service.product;


/**
 * @author chenrizhang
 *
 */
public enum ProductState {
  using("使用中"), deleted("已删除");

  private String caption;

  private ProductState(String caption) {
    this.caption = caption;
  }

  public String getCaption() {
    return caption;
  }
}
