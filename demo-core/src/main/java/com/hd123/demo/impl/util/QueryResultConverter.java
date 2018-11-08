package com.hd123.demo.impl.util;

import com.hd123.rumba.commons.biz.query.QueryResult;
import com.hd123.rumba.commons.lang.ExceptionUtil;
import com.hd123.rumba.commons.util.converter.Converter;
import com.hd123.rumba.commons.util.converter.ConverterUtil;

/**
 * QueryResult 转换辅助工具
 * 
 * @author suizhe
 * 
 */
public class QueryResultConverter {

  public static <S, T> QueryResult<T> convert(QueryResult<S> source, Converter<S, T> converter) {
    if (source == null)
      return null;
    if (converter == null) {
      throw ExceptionUtil.nullArgument("converter");
    }

    QueryResult<T> target = new QueryResult<T>();
    target.setMore(source.isMore());
    target.setPage(source.getPage());
    target.setPageCount(source.getPageCount());
    target.setPageSize(source.getPageSize());
    target.setRecordCount(source.getRecordCount());
    target.setRecords(ConverterUtil.convert(source.getRecords(), converter));
    return target;
  }

}