/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2013，所有权利保留。
 * 
 * 项目名：	demo-transport
 * 文件名：	DemoCXFServlet.java
 * 模块说明：	
 * 修改历史：
 * 2013-8-26 - wulei - 创建。
 */
package com.hd123.demo.cxf;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.cxf.transport.servlet.CXFServlet;

import com.hd123.ia.audit.service.EventContext;
import com.hd123.rumba.commons.json.JsonArray;
import com.hd123.rumba.commons.json.JsonObject;

/**
 * @author liuguilin
 * 
 */
public class DemoCXFServlet extends CXFServlet {

  private static final long serialVersionUID = 6463829812733899669L;

  private static final ThreadLocal<EventContext> threadEventContext = new ThreadLocal<EventContext>();

  /**
   * 取得线程事件上下文。
   */
  public static EventContext getThreadEventContext() {
    EventContext context = new EventContext();
    EventContext threadContext = threadEventContext.get();
    if (threadContext != null) {
      context.setUserMachine(threadContext.getUserMachine());
      context.setServerMachine(threadContext.getServerMachine());
    }
    return context;
  }

  @Override
  protected void handleRequest(HttpServletRequest request, HttpServletResponse response)
      throws ServletException {
    EventContext context = new EventContext();
    context.setUserMachine(request.getRemoteAddr());
    context.setServerMachine(request.getLocalAddr());
    threadEventContext.set(context);

    super.handleRequest(request, response);
  }

  /**
   * 构造异常的HTTP-BODY。
   * 
   * @param exception
   *          异常信息。
   */
  protected String buildExceptionBody(String exception) {
    JsonObject jo = new JsonObject();
    jo.put("exceptionClass", "java.lang.IllegalStateException");
    jo.put("message", exception);
    jo.put("stackTrace", new JsonArray());
    jo.put("cause", null);
    return jo.toString();
  }

}
