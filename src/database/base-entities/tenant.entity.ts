import { Entity, Column, PrimaryGeneratedColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseDO } from '../base.entity';

/**
 * 租户实体
 * 对应 system_tenant 表
 */
@Entity('system_tenant')
@Index('idx_tenant_name', ['name'], { unique: true })
export class TenantDO extends BaseDO {
  /**
   * 套餐编号 - 系统
   */
  static readonly PACKAGE_ID_SYSTEM = 0;

  @PrimaryGeneratedColumn()
  declare id: number;

  /**
   * 租户名，唯一
   */
  @Column({ 
    type: 'varchar', 
    length: 30, 
    unique: true,
    comment: '租户名' 
  })
  name: string;

  /**
   * 联系人的用户编号
   */
  @Column({ 
    name: 'contact_user_id',
    type: 'bigint',
    nullable: true,
    comment: '联系人的用户编号' 
  })
  contactUserId: number;

  /**
   * 联系人
   */
  @Column({ 
    name: 'contact_name',
    type: 'varchar', 
    length: 30, 
    nullable: true,
    comment: '联系人' 
  })
  contactName: string;

  /**
   * 联系手机
   */
  @Column({ 
    name: 'contact_mobile',
    type: 'varchar', 
    length: 20, 
    nullable: true,
    comment: '联系手机' 
  })
  contactMobile: string;

  /**
   * 租户状态：0开启 1关闭
   */
  @Column({ 
    type: 'tinyint', 
    default: 0,
    comment: '租户状态（0正常 1停用）' 
  })
  status: number;

  /**
   * 绑定域名
   */
  @Column({ 
    type: 'varchar', 
    length: 255, 
    nullable: true,
    comment: '绑定域名' 
  })
  website: string;

  /**
   * 租户套餐编号
   * 关联 TenantPackageDO.id
   * 特殊逻辑：系统内置租户，不使用套餐，暂时使用 PACKAGE_ID_SYSTEM 标识
   */
  @Column({ 
    name: 'package_id',
    type: 'bigint',
    default: 0,
    comment: '租户套餐编号' 
  })
  packageId: number;

  /**
   * 过期时间
   */
  @Column({ 
    name: 'expire_time',
    type: 'timestamp',
    nullable: true,
    comment: '过期时间' 
  })
  expireTime: Date;

  /**
   * 账号数量
   */
  @Column({ 
    name: 'account_count',
    type: 'int',
    default: 0,
    comment: '账号数量' 
  })
  accountCount: number;
}

/**
 * 租户套餐实体
 * 对应 system_tenant_package 表
 */
@Entity('system_tenant_package')
@Index('idx_tenant_package_name', ['name'], { unique: true })
export class TenantPackageDO extends BaseDO {
  @PrimaryGeneratedColumn()
  declare id: number;

  /**
   * 套餐名，唯一
   */
  @Column({ 
    type: 'varchar', 
    length: 30, 
    unique: true,
    comment: '套餐名' 
  })
  name: string;

  /**
   * 租户套餐状态：0开启 1关闭
   */
  @Column({ 
    type: 'tinyint', 
    default: 0,
    comment: '租户套餐状态（0正常 1停用）' 
  })
  status: number;

  /**
   * 备注
   */
  @Column({ 
    type: 'varchar', 
    length: 255, 
    nullable: true,
    comment: '备注' 
  })
  remark: string;

  /**
   * 关联的菜单编号
   * 存储为 JSON 数组
   */
  @Column({ 
    name: 'menu_ids',
    type: 'json',
    nullable: true,
    comment: '关联的菜单编号' 
  })
  menuIds: number[];
}