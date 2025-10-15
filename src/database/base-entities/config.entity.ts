import { Entity, Column } from 'typeorm';
import { BaseDO } from '../base.entity';

/**
 * 参数配置实体类
 * 对齐 RuoYi-Vue-Pro 的 ConfigDO
 */
@Entity('infra_config')
export class ConfigDO extends BaseDO {
  /**
   * 参数分组
   */
  @Column({ name: 'category', type: 'varchar', length: 50 })
  category: string;

  /**
   * 参数名称
   */
  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  /**
   * 参数键名
   */
  @Column({ name: 'config_key', type: 'varchar', length: 100, unique: true })
  key: string;

  /**
   * 参数键值
   */
  @Column({ name: 'value', type: 'varchar', length: 500 })
  value: string;

  /**
   * 系统内置：1-是，0-否
   */
  @Column({ name: 'type', type: 'smallint', default: 0 })
  type: number;

  /**
   * 是否可见：1-是，0-否
   */
  @Column({ name: 'visible', type: 'boolean', default: true })
  visible: boolean;

  /**
   * 备注
   */
  @Column({ name: 'remark', type: 'varchar', length: 500, nullable: true })
  remark?: string;
}
