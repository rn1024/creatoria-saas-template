import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';
import { BaseDO } from '../base.entity';

/**
 * 操作日志实体
 * 对应 system_operate_log 表
 */
@Entity('system_operate_log')
@Index('idx_operate_user_id', ['userId'])
@Index('idx_operate_biz_id', ['bizId'])
@Index('idx_operate_create_time', ['createTime'])
export class OperateLogDO extends BaseDO {
  @PrimaryGeneratedColumn()
  declare id: number;

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
    comment: '用户编号' 
  })
  userId: number;

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
   * 操作模块
   */
  @Column({ 
    name: 'module', 
    type: 'varchar', 
    length: 50,
    comment: '操作模块' 
  })
  module: string;

  /**
   * 操作名
   */
  @Column({ 
    name: 'name', 
    type: 'varchar', 
    length: 50,
    comment: '操作名' 
  })
  name: string;

  /**
   * 操作分类
   * 枚举 {@link OperateTypeEnum}
   */
  @Column({ 
    name: 'type', 
    type: 'tinyint',
    comment: '操作分类' 
  })
  type: number;

  /**
   * 操作明细
   */
  @Column({ 
    name: 'content', 
    type: 'text',
    nullable: true,
    comment: '操作明细' 
  })
  content?: string;

  /**
   * 拓展字段
   */
  @Column({ 
    name: 'exts', 
    type: 'json',
    nullable: true,
    comment: '拓展字段' 
  })
  exts?: Record<string, any>;

  /**
   * 请求方法名
   */
  @Column({ 
    name: 'request_method', 
    type: 'varchar', 
    length: 16,
    comment: '请求方法名' 
  })
  requestMethod: string;

  /**
   * 请求地址
   */
  @Column({ 
    name: 'request_url', 
    type: 'varchar', 
    length: 255,
    comment: '请求地址' 
  })
  requestUrl: string;

  /**
   * 用户 IP
   */
  @Column({ 
    name: 'user_ip', 
    type: 'varchar', 
    length: 50,
    nullable: true,
    comment: '用户 IP' 
  })
  userIp?: string;

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

  /**
   * Java 方法名
   */
  @Column({ 
    name: 'java_method', 
    type: 'varchar', 
    length: 512,
    comment: 'Java 方法名' 
  })
  javaMethod: string;

  /**
   * Java 方法的参数
   */
  @Column({ 
    name: 'java_method_args', 
    type: 'text',
    nullable: true,
    comment: 'Java 方法的参数' 
  })
  javaMethodArgs?: string;

  /**
   * 操作时间
   */
  @Column({ 
    name: 'start_time', 
    type: 'timestamp',
    comment: '操作时间' 
  })
  startTime: Date;

  /**
   * 执行时长
   */
  @Column({ 
    name: 'duration', 
    type: 'int',
    comment: '执行时长' 
  })
  duration: number;

  /**
   * 结果码
   */
  @Column({ 
    name: 'result_code', 
    type: 'int',
    default: 0,
    comment: '结果码' 
  })
  resultCode: number;

  /**
   * 结果提示
   */
  @Column({ 
    name: 'result_msg', 
    type: 'varchar', 
    length: 512,
    nullable: true,
    comment: '结果提示' 
  })
  resultMsg?: string;

  /**
   * 结果数据
   */
  @Column({ 
    name: 'result_data', 
    type: 'text',
    nullable: true,
    comment: '结果数据' 
  })
  resultData?: string;

  /**
   * 业务编号
   */
  @Column({ 
    name: 'biz_id', 
    type: 'bigint',
    nullable: true,
    comment: '业务编号' 
  })
  bizId?: number;
}