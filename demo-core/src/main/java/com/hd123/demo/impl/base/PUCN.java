/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2012，所有权利保留。
 * 
 * 项目名： m3-tenant-ejb
 * 文件名： PUCN.java
 * 模块说明：    
 * 修改历史：
 * 2012-9-13 - suizhe - 创建。
 */
package com.hd123.demo.impl.base;

import java.io.Serializable;

import javax.persistence.Embeddable;

import com.hd123.rumba.commons.biz.entity.HasCode;
import com.hd123.rumba.commons.biz.entity.HasName;
import com.hd123.rumba.commons.biz.entity.HasUCN;
import com.hd123.rumba.commons.biz.entity.HasUuid;
import com.hd123.rumba.commons.biz.entity.Injectable;

/**
 * @author suizhe
 * 
 */
@Embeddable
public class PUCN implements Serializable, HasUCN, Injectable {
  private static final long serialVersionUID = -6377020112185120239L;

  private String uuid;
  private String code;
  private String name;

  public static PUCN newInstance(Object source) {
    if (source == null)
      return null;
    PUCN target = new PUCN();
    target.inject(source);
    return target;
  }

  @Override
  public String getUuid() {
    return uuid;
  }

  @Override
  public void setUuid(String uuid) {
    this.uuid = uuid;
  }

  @Override
  public String getCode() {
    return code;
  }

  @Override
  public void setCode(String code) {
    this.code = code;
  }

  @Override
  public String getName() {
    return name;
  }

  @Override
  public void setName(String name) {
    this.name = name;
  }

  @Override
  public void inject(Object source) {
    if (source == null) {
      return;
    }
    if (source instanceof HasUuid) {
      setUuid(((HasUuid) source).getUuid());
    }
    if (source instanceof HasCode) {
      this.code = ((HasCode) source).getCode();
    }
    if (source instanceof HasName) {
      this.name = ((HasName) source).getName();
    }
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((code == null) ? 0 : code.hashCode());
    result = prime * result + ((name == null) ? 0 : name.hashCode());
    String uuid = getUuid();
    result = prime * result + ((uuid == null) ? 0 : uuid.hashCode());
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (!(obj instanceof PUCN)) {
      return false;
    }
    PUCN other = (PUCN) obj;
    if (code == null) {
      if (other.code != null) {
        return false;
      }
    } else if (!code.equals(other.code)) {
      return false;
    }
    if (name == null) {
      if (other.name != null) {
        return false;
      }
    } else if (!name.equals(other.name)) {
      return false;
    }
    if (getUuid() == null) {
      if (other.getUuid() != null) {
        return false;
      }
    } else if (!getUuid().equals(other.getUuid())) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    StringBuffer sb = new StringBuffer();
    sb.append(getUuid());
    sb.append("\n");
    sb.append(name);
    sb.append("[");
    sb.append(code);
    sb.append("]");
    return sb.toString();
  }

  /**
   * {@link PUCN}对应数据表结构相关常量定义。
   * 
   * @author 陈日漳
   * @since 1.8
   * 
   */
  public static class Schema {
    /** 字段长度，单位字符，对应属性{@link PUCN#getUuid()}。 */
    public static final int LENGTH_UUID= 38;
    /** 代码长度，单位字节，对应属性{@link PUCN#getCode()}。 */
    public static final int LENGTH_CODE = 32;
    /** 名称长度，单位字符，对应属性{@link PUCN#getName()}。 */
    public static final int LENGTH_NAME = 64;
  }
}
