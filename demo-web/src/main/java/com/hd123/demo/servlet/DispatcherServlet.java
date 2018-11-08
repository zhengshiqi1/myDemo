package com.hd123.demo.servlet;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;

import com.hd123.demo.service.exception.DemoServiceException;
import com.hd123.rumba.commons.rs.WebApplicationExceptionUtil;
import com.hd123.rumba.webframe.session.Session;

/**
 * 
 * @author chenrizhang
 */
public class DispatcherServlet extends org.springframework.web.servlet.DispatcherServlet {
  private static final long serialVersionUID = 7410405574199043465L;

  @Override
  protected void doService(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    try {
      logger.debug("请求：" + request.getRequestURL());
      Session.initial(request.getSession());
      super.doService(request, response);
    } catch (Exception e) {
      writeResponse(response, e);
    }
  }

  private void writeResponse(HttpServletResponse response, Exception e) throws IOException {
    logger.error(e);

    if (e instanceof WebApplicationException) {
      response.setStatus(((WebApplicationException) e).getResponse().getStatus());
      try {
        if (((WebApplicationException) e).getResponse().getStatus() == Response.Status.INTERNAL_SERVER_ERROR
            .getStatusCode())
          throw WebApplicationExceptionUtil.unbox((WebApplicationException) e,
              DemoServiceException.class);
      } catch (Exception e1) {
        e = e1;
      }
    } else {
      response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }
    response.setCharacterEncoding("UTF-8");
    response.setContentType("application/json");
    response.getWriter().print(e.getCause() != null ? e.getCause().getMessage() : e.getMessage());
  }

}
