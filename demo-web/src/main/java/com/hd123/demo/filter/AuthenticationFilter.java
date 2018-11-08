package com.hd123.demo.filter;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import com.hd123.ia.authen.service.authentication.AuthenticationException;
import com.hd123.ia.authen.service.authentication.AuthenticationService;
import com.hd123.ia.authen.service.password.PasswordCredential;
import com.hd123.ia.authen.service.user.User;
import com.hd123.ia.authen.service.user.UserService;
import com.hd123.rumba.commons.biz.entity.Operator;
import com.hd123.rumba.commons.i18n.DefaultStringValue;
import com.hd123.rumba.commons.i18n.Resources;
import com.hd123.rumba.webframe.gwt.nolicense.intf.client.NoLicenseUrlParams;
import com.hd123.rumba.webframe.request.FilterUtil;
import com.hd123.rumba.webframe.request.GWTModuleDispatcher;
import com.hd123.rumba.webframe.request.GwtUrl;
import com.hd123.rumba.webframe.session.Session;

/**
 * 访问请求过滤器，提供身份认证检查。若尚未登录，将会重定向到登录界面。
 * 
 * @author lxm
 * 
 */
public class AuthenticationFilter implements Filter {

  private static final String DEBUG_LOGIN_PROPERTIES = "/debug-login.properties";
  private static final String KEY_DEBUG_LOGIN_NAME = "login";
  private static final String KEY_DEBUG_PASSWORD = "password";

  private static final Logger logger = LoggerFactory.getLogger(AuthenticationFilter.class);

  private ApplicationContext appCtx;

  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
    appCtx = WebApplicationContextUtils.getWebApplicationContext(filterConfig.getServletContext());
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    if (request instanceof HttpServletRequest == false
        || response instanceof HttpServletResponse == false) {
      chain.doFilter(request, response);
      return;
    }

    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;

    if (checkLicense() == false) {
      redirectToNoLicense(httpRequest, httpResponse);
      return;
    }

    Session.initial(httpRequest.getSession());

    if (Session.getInstance().getCurrentUser() == null) {
      loginForDebug(httpRequest);
    }

    if (Session.getInstance().getCurrentUser() == null) {
      logger.debug("AuthenticationFilter redirectToEntry");
      FilterUtil.redirectToEntry(httpRequest, httpResponse);
      return;
    }

    chain.doFilter(request, response);
  }

  @Override
  public void destroy() {
    // Do Nothing
  }

  private boolean checkLicense() {
    return true;
  }

  private boolean isGwtHostMode(HttpServletRequest request) {
    // 按照如下方式判断是否是GWT Host-mode：
    // 1、localAddr == 127.0.0.1
    // 2、当前运行于jetty环境中。
    return "127.0.0.1".equals(request.getLocalAddr())
        && request.getSession().getClass().getName().startsWith("org.eclipse.jetty.");
  }

  public void loginForDebug(HttpServletRequest request) {
    if (isGwtHostMode(request) == false) {
      return;
    }
    logger.warn("Run in GWT Host-mode. Try to load " + DEBUG_LOGIN_PROPERTIES);
    try {
      InputStream is = getClass().getResourceAsStream(DEBUG_LOGIN_PROPERTIES);
      Properties props = new Properties();
      props.load(is);

      String loginName = props.getProperty(KEY_DEBUG_LOGIN_NAME);
      String password = props.getProperty(KEY_DEBUG_PASSWORD);

      AuthenticationService authenService = appCtx.getBean(
          AuthenticationService.DEFAULT_CONTEXT_ID, AuthenticationService.class);
      authenService.authenticate(loginName, PasswordCredential.valueOf(password));

      UserService userService = appCtx.getBean(UserService.DEFAULT_CONTEXT_ID, UserService.class);
      User user = userService.get(loginName);
      if (user == null) {
        logger.error(R.R.failToDebugLogin());
        return;
      }

      Operator sessionUser = new Operator();
      sessionUser.inject(user);
      Session.getInstance().setCurrentUser(sessionUser);
    } catch (IOException e) {
      logger.error(R.R.failToDebugLogin(), e);
    } catch (AuthenticationException e) {
      logger.error(R.R.failToDebugLogin(), e);
    }
  }

  private void redirectToNoLicense(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    assert request != null;
    assert response != null;

    GwtUrl newUrl = new GwtUrl(NoLicenseUrlParams.ENTRY_CONTEXT, NoLicenseUrlParams.ENTRY_MODULE,
        NoLicenseUrlParams.ENTRY_FILE);

    StringBuffer location = new StringBuffer();
    location.append(FilterUtil.getWebAppBaseUrl(request));
    location.append(GWTModuleDispatcher.getInstance().dispatchGwtUrl(newUrl));
    response.sendRedirect(location.toString());
  }

  public static interface R {
    public static final R R = Resources.create(R.class);

    @DefaultStringValue("调试模式下，登录系统失败！")
    String failToDebugLogin();
  }
}
