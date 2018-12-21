package com.hd123.demo.service.base;

import java.io.Serializable;

public class Test implements Serializable {

  private static final long serialVersionUID = -4575729513448309469L;

  private String uuid;

  public String getUuid() {
    return uuid;
  }

  public void setUuid(String uuid) {
    this.uuid = uuid;
  }

}
