package com.hd123.demo.impl.util;

import com.hd123.rumba.commons.biz.entity.HasVersion;
import com.hd123.rumba.commons.biz.entity.VersionConflictException;

/**
 * @author chenrizhang
 * 
 */
public class VersionUtil {
  public static void checkVersion(long version, HasVersion poVersion, String classCaption,
      String entitySpec) throws VersionConflictException {
    if (poVersion != null && version != poVersion.getVersion())
      throw VersionConflictException.create2(classCaption, poVersion.getVersion(), version,
          entitySpec);
  }
}
