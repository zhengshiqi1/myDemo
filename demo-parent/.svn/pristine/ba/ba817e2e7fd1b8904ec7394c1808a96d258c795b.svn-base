/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2013，所有权利保留。
 * 
 * 项目名：	account-api
 * 文件名：	JsonUtil.java
 * 模块说明：	
 * 修改历史：
 * 2013-9-3 - suizhe - 创建。
 */
package com.hd123.demo.util;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hd123.demo.format.DateTimeFormat;
import com.hd123.rumba.commons.lang.StringUtil;

/**
 * @author suizhe
 * 
 */
public class JsonUtil {

  private static final String DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";

  private static ThreadLocal<ObjectMapper> threadLocal = new ThreadLocal<ObjectMapper>() {
    @Override
    protected ObjectMapper initialValue() {
      ObjectMapper mapper = new ObjectMapper();
      mapper.setDateFormat(new DateTimeFormat(DATE_FORMAT));
      mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
      mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
      return mapper;
    }
  };

  public static String objectToJson(Object value) throws RuntimeException {
    if (value == null)
      return null;

    try {
      return threadLocal.get().writeValueAsString(value);
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  /**
   * 此方法已废弃，请用小写字母开头的jsonToObject方法。
   * 
   * @param json
   * @param valueType
   */
  @Deprecated
  public static <T> T JsonToObject(String json, Class<T> valueType) {
    return jsonToObject(json, valueType);
  }

  public static <T> T jsonToObject(String json, Class<T> valueType) throws RuntimeException {
    if (StringUtil.isNullOrBlank(json))
      return null;

    try {
      return threadLocal.get().readValue(json, valueType);
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  public static <T> List<T> jsonToArrayList(String json, Class<T> elementType)
      throws RuntimeException {
    if (StringUtil.isNullOrBlank(json)) {
      return new ArrayList<T>();
    }

    try {
      return threadLocal.get().readValue(json,
          threadLocal.get().getTypeFactory().constructParametricType(ArrayList.class, elementType));
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }
}
