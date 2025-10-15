import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { BaseDO } from '../base.entity';

/**
 * 登录日志实体
 * 对应 system_login_log 表
 */
@Entity('system_login_log')
@Index('idx_login_user_id', ['userId'])
@Index('idx_login_username', ['username'])
@Index('idx_login_create_time', ['createTime'])
export class LoginLogDO extends BaseDO {
  @PrimaryGeneratedColumn()
  declare id: number;

  /**
   * 日志类型
   * 枚举 {@link LoginLogTypeEnum}
   */
  @Column({ 
    name: 'log_type', 
    type: 'tinyint',
    comment: '日志类型' 
  })
  logType: number;

  /**
   * 链路追踪编号
   */
  @Column({ 
    name: 'trace_id', 
    type: 'varchar', 
    length: 64,
    nullable: true,
    comment: '链路追踪编号' 
  })
  traceId?: string;

  /**
   * 用户编号
   */
  @Column({ 
    name: 'user_id', 
    type: 'bigint',
    nullable: true,
    comment: '用户编号' 
  })
  userId?: number;

  /**
   * 用户类型
   * 枚举 {@link UserTypeEnum}
   */
  @Column({ 
    name: 'user_type', 
    type: 'tinyint',
    default: 0,
    comment: '用户类型' 
  })
  userType: number;

  /**
   * 用户账号
   */
  @Column({ 
    name: 'username', 
    type: 'varchar', 
    length: 50,
    comment: '用户账号' 
  })
  username: string;

  /**
   * 登录结果
   * 枚举 {@link LoginResultEnum}
   */
  @Column({ 
    name: 'result', 
    type: 'tinyint',
    comment: '登录结果' 
  })
  result: number;

  /**
   * 用户 IP
   */
  @Column({ 
    name: 'user_ip', 
    type: 'varchar', 
    length: 50,
    comment: '用户 IP' 
  })
  userIp: string;

  /**
   * 浏览器 UA
   */
  @Column({ 
    name: 'user_agent', 
    type: 'varchar', 
    length: 500,
    nullable: true,
    comment: '浏览器 UA' 
  })
  userAgent?: string;
}

/**
 * 登录日志类型枚举
 */
export enum LoginLogTypeEnum {
  LOGIN_USERNAME = 100,    // 使用账号登录
  LOGIN_SOCIAL = 101,      // 使用社交登录
  LOGIN_MOBILE = 103,      // 使用手机登录
  LOGIN_SMS = 104,         // 使用短信登录
  LOGOUT_SELF = 200,       // 主动登出
  LOGOUT_DELETE = 202,     // 强制退出
}

/**
 * 登录结果枚举
 */
export enum LoginResultEnum {
  SUCCESS = 0,    // 成功
  BAD_CREDENTIALS = 10,     // 账号或密码不正确
  USER_DISABLED = 20,       // 用户被禁用
  CAPTCHA_NOT_FOUND = 30,   // 图片验证码不存在
  CAPTCHA_CODE_ERROR = 31,  // 图片验证码不正确
}