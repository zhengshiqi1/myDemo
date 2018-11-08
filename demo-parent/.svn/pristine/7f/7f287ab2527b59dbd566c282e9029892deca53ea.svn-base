/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2015，所有权利保留。
 * 
 * 项目名：	demo-server
 * 文件名：	BasicRSService.java
 * 模块说明：	
 * 修改历史：
 * 2015-3-30 - liuguilin - 创建。
 */
package com.hd123.demo.rs.server;

import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.tuple.Pair;

import com.hd123.demo.cxf.DemoCXFServlet;
import com.hd123.ia.audit.logger.AuditContext;
import com.hd123.ia.audit.logger.AuditLogger;
import com.hd123.ia.audit.service.EventContext;
import com.hd123.ia.audit.service.Keywords;
import com.hd123.rumba.commons.biz.entity.OperateContext;
import com.hd123.rumba.commons.biz.entity.Operator;
import com.hd123.rumba.commons.lang.StringUtil;

/**
 * REST接口服务基类，提供记录审计日志的方法。
 * 
 * @author liuguilin
 * 
 */
public class BasicRSService {

  private final AuditLogger auditLogger = AuditLogger.getLogger(getClass());
  private final Map<String, Pair<String, String>> restMethods;

  public BasicRSService() {
    restMethods = new HashMap<String, Pair<String, String>>();
    for (Class clazz : getClass().getInterfaces()) {
      javax.ws.rs.Path servicePath = (javax.ws.rs.Path) clazz.getAnnotation(javax.ws.rs.Path.class);
      if (servicePath == null) {
        continue;
      }

      for (Method method : clazz.getMethods()) {
        StringBuilder path = new StringBuilder();
        path.append("/demo-server");
        path.append(formatPathSegment(servicePath.value()));

        javax.ws.rs.Path methodPath = method.getAnnotation(javax.ws.rs.Path.class);
        if (methodPath != null) {
          path.append(formatPathSegment(methodPath.value()));
        }

        if (method.getAnnotation(javax.ws.rs.GET.class) != null) {
          restMethods.put(method.getName(), Pair.of(path.toString(), "GET"));
        } else if (method.getAnnotation(javax.ws.rs.POST.class) != null) {
          restMethods.put(method.getName(), Pair.of(path.toString(), "POST"));
        } else if (method.getAnnotation(javax.ws.rs.PUT.class) != null) {
          restMethods.put(method.getName(), Pair.of(path.toString(), "PUT"));
        } else if (method.getAnnotation(javax.ws.rs.DELETE.class) != null) {
          restMethods.put(method.getName(), Pair.of(path.toString(), "DELETE"));
        }
      }
      break;
    }
  }

  /**
   * 记录审计日志。
   * 
   * @param methodName
   *          传入null或非REST接口方法将忽略操作。
   * @param operCtx
   * @param keywords
   *          关键字序列，按照关键字名、值、名、值...的方式传递。
   * @param eventData
   */
  protected void auditLog(String methodName, OperateContext operCtx, Keywords keywords,
      String eventData) {
    Pair<String, String> restMethod = restMethods.get(methodName);
    if (restMethod == null) {
      return;
    }
    EventContext eventContext = DemoCXFServlet.getThreadEventContext();
    eventContext.setNamespace(restMethod.getKey());
    Operator operator = null;

    AuditContext auditContext = AuditContext.getThreadContext();
    if (auditContext != null) {
      eventContext.setUserMachine(auditContext.getUserMachine());
      eventContext.setServerMachine(auditContext.getServerMachine());
      if (StringUtil.isNullOrBlank(auditContext.getUserName()) == false) {
        operator = new Operator(auditContext.getUserName(), auditContext.getUserName());
      }
    }

    if (operator == null)
      operator = operCtx == null ? null : Operator.newInstance(operCtx.getOperator());

    auditLogger.log(operator, restMethod.getValue(), keywords, eventData, eventContext);
  }

  /**
   * 格式化路径片段：
   * <ol>
   * <li>如果路径为null或空白字符串或“/”，返回空字符串。</li>
   * <li>如果路径不以“?”开头，格式化后以“/”开头，并且不以“/”结尾。</li>
   * <li>将路径中的“{”和“}”分别替换为“<”和“>”。</li>
   * </ol>
   * 
   * @param path
   */
  private String formatPathSegment(String path) {
    if (StringUtil.isNullOrBlank(path)) {
      return "";
    }
    String formatted = path.trim().replace('{', '<').replace('}', '>');
    if (formatted.startsWith("?") == false && formatted.startsWith("/") == false) {
      formatted = "/" + formatted;
    }
    if (formatted.endsWith("/")) {
      formatted = formatted.substring(0, formatted.length() - 1);
    }
    return formatted;
  }
}
