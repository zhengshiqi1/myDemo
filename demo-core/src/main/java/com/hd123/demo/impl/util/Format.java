/**
 * 版权所有(C)，上海海鼎信息工程股份有限公司，2016，所有权利保留。
 * 
 * 项目名：	m3-account-core
 * 文件名：	Format.java
 * 模块说明：	
 * 修改历史：
 * 2016年1月12日 - LiBin - 创建。
 */
package com.hd123.demo.impl.util;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;

/**
 * 格式化常量定义，遵循JDK标准。
 * <p>
 * 
 * 分别对于日期和数值类型分别遵循以下两套来自jdk的标准：
 * <ol>
 * <li>对于日期类型，参见{@link java.text.SimpleDateFormat}；
 * <li>对于数值类型，参见{@link java.text.DecimalFormat}。
 * </ol>
 * 
 * @author LiBin
 * 
 */
public class Format {
  
  /** 日期格式：年月 */
  public static final String yM = "yyyyMM";
  public static final SimpleDateFormat fmt_yM = new SimpleDateFormat(yM);
  /** 日期格式：年月日 */
  public static final String yMd = "yyyy-M-d";
  public static final SimpleDateFormat fmt_yMd = new SimpleDateFormat(yMd);
  /** 时间格式：时分 */
  public static final String Hm = "HH:mm";
  public static final SimpleDateFormat fmt_Hm = new SimpleDateFormat(Hm);
  /** 时间格式：时分秒 */
  public static final String Hms = Hm + ":ss";
  public static final SimpleDateFormat fmt_Hms = new SimpleDateFormat(Hms);
  /** 时间格式：时分秒+毫秒 */
  public static final String HmsS = Hms + ".SSS";
  public static final SimpleDateFormat fmt_HmsS = new SimpleDateFormat(HmsS);
  /** 日期格式：年月日+时分 */
  public static final String yMdHm = yMd + " " + Hm;
  public static final SimpleDateFormat fmt_yMdHm = new SimpleDateFormat(yMdHm);
  /** 日期格式：年月日+时分秒 */
  public static final String yMdHms = yMd + " " + Hms;
  public static final SimpleDateFormat fmt_yMdHms = new SimpleDateFormat(yMdHms);
  /** 日期格式：年月日+时分秒+毫秒 */
  public static final String yMdHmsS = yMd + " " + HmsS;
  public static final SimpleDateFormat fmt_yMdHmsS = new SimpleDateFormat(yMdHmsS);

  /** 数值格式：计数 */
  public static final String count = "0";
  public static final DecimalFormat fmt_count = new DecimalFormat(count);
  /** 数值格式：数量 */
  public static final String qty = ",##0.###";
  public static final DecimalFormat fmt_qty = new DecimalFormat(qty);
  /** 数值格式：金额 */
  public static final String money = ",##0.00";
  public static final DecimalFormat fmt_money = new DecimalFormat(money);
  /** 数值格式：单价 */
  public static final String price = ",##0.00";
  public static final DecimalFormat fmt_price = new DecimalFormat(price);
  /** 数值格式：箱数 */
  public static final String caseCount = "0.0";
  public static final DecimalFormat fmt_caseCount = new DecimalFormat(caseCount);
  /** 数值格式：比率 */
  public static final String rate = "0.####";
  public static final DecimalFormat fmt_rate = new DecimalFormat(rate);
  /** 数值格式：百分比 */
  public static final String percent = "0.##%";
  public static final DecimalFormat fmt_percent = new DecimalFormat(percent);
  
  /** 数值格式：百分比 */
  public static final String percentFour = "0.####%";
  public static final DecimalFormat fmt_percentFour = new DecimalFormat(percentFour);

  /** 用于http传输的日期格式 */
  public static final SimpleDateFormat REST_DATE_FORMAT = new SimpleDateFormat(
      "yyyy-MM-dd'T'HH:mm:ss.SSSZ");

}
