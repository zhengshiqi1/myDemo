package com.hd123.demo.impl.util;

import java.lang.reflect.Method;
import java.util.List;

import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.rumba.commons.biz.validator.BeanValidator;
import com.hd123.rumba.commons.biz.validator.ConstraintViolation;

/**
 * 验证器工具,用于实体保存前的检查
 * 
 * @author suizhe
 * 
 */
public class ValidatorUtil {

  /**
   * 验证一个对象
   * 
   * @param obj
   *          对象
   * @param constObjs
   *          实体对应的常量对象数组，可以为空
   * @throws DemoServiceException
   */
  public static void validate(Object obj, Object... constObjs) throws DemoServiceException {
    if (obj == null)
      return;

    BeanValidator validator = new BeanValidator();
    List<ConstraintViolation> list = validator.validate(obj);

    if (list == null || list.size() == 0)
      return;

    StringBuffer sb = new StringBuffer();
    for (ConstraintViolation v : list) {
      sb.append(getCaption(v.getPropertyName(), constObjs) + " " + v.getMessage());
      sb.append("\n");
    }

    throw new DemoServiceException(sb.toString());
  }

  private static String getCaption(String fieldName, Object... constObjs) {
    if (constObjs == null || constObjs.length == 0)
      return fieldName;

    // 直接匹配
    String caption = getFieldCaption(fieldName, constObjs);
    if (caption != null)
      return caption;

    // 去掉位置匹配
    caption = getFieldCaption(fieldName.replaceAll("\\[[^\\]]*\\]", "").replaceAll("\\.", "_"),
        constObjs);
    if (caption != null)
      return caption;

    StringBuffer sb = new StringBuffer();
    String[] fields = fieldName.split("\\.");
    String name = null;
    for (String s : fields) {
      int idx = s.indexOf("[");
      if (idx < 0)
        idx = s.indexOf("(");
      if (idx < 0) {
        if (name == null)
          name = s;
        else
          name = name + "_" + s;
      } else {
        if (name != null) {
          caption = getFieldCaption(name, constObjs);
          if (caption != null) {
            sb.append(caption);
            sb.append(".");
          }
          name = null;
        }

        String nm = s.substring(0, idx);
        caption = getFieldCaption(nm, constObjs);
        if (caption != null) {
          sb.append(caption);
          sb.append(s.substring(idx, s.length()));
          sb.append(".");
        }
      }
    }

    if (name != null) {
      caption = getFieldCaption(name, constObjs);
      if (caption != null)
        sb.append(caption);
    }

    caption = sb.toString();
    if (caption == null || "".equals(caption))
      return fieldName;
    else
      return caption;
  }

  private static String getFieldCaption(String fieldName, Object... constObjs) {
    if (constObjs == null || constObjs.length == 0)
      return null;

    for (Object o : constObjs) {
      try {
        Method m = o.getClass().getMethod(fieldName, (Class[]) null);
        return (String) m.invoke(o, (Object[]) null);
      } catch (Exception e) {
      }
    }
    return null;
  }

}
