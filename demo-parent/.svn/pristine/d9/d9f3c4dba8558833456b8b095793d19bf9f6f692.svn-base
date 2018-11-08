package com.hd123.demo.format;

import java.text.DateFormat;
import java.text.FieldPosition;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author cRazy
 *
 */
public class DateTimeFormat extends DateFormat {
  private static final long serialVersionUID = -1575666849978279311L;

  /** 默认日期格式模板。 */
  public static final String DEFAULT_DATE_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSZ";

  /** 日期匹配格式数组。 */
  public static final String[] DATE_FORMATS = new String[] {
      "yyyy-MM-dd'T'HH:mm:ss.SSSZ", "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd" };

  private String dateFormat;
  private SimpleDateFormat fmt;
  private List<SimpleDateFormat> sdfs = new ArrayList<SimpleDateFormat>();

  public DateTimeFormat(String dateFormat) {
    this.dateFormat = dateFormat;
    for (String format : DATE_FORMATS) {
      SimpleDateFormat sdf = new SimpleDateFormat(format);
      sdfs.add(sdf);
    }
    fmt = new SimpleDateFormat(dateFormat);
  }

  public DateTimeFormat() {
    this(DEFAULT_DATE_FORMAT);
  }

  @Override
  public StringBuffer format(Date date, StringBuffer toAppendTo, FieldPosition fieldPosition) {
    return fmt.format(date, toAppendTo, fieldPosition);
  }

  @Override
  public Date parse(String source, ParsePosition pos) {
    RuntimeException pe = null;
    for (SimpleDateFormat sdf : sdfs) {
      try {
        Date date = sdf.parse(source.trim(), pos);
        if (date != null)
          return date;
      } catch (RuntimeException e) {
        pe = e;
      }
    }
    throw pe;
  }

  /**
   * Creates a copy of this <code>SimpleDateFormat</code>. This also clones the
   * format's date format symbols.
   *
   * @return a clone of this <code>SimpleDateFormat</code>
   */
  public Object clone() {
    return new DateTimeFormat(dateFormat);
  }
}
