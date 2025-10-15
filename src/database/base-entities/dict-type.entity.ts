import { BaseDO } from '@app/database/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum DictStatusEnum {
  ENABLE = 0, // 启用
  DISABLE = 1, // 禁用
}

@Entity('system_dict_type')
export class DictTypeDO extends BaseDO {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  declare id: number;

  @Column('varchar', { name: 'name', comment: '字典名称', length: 100 })
  name: string;

  @Column('varchar', {
    name: 'type',
    comment: '字典类型',
    length: 100,
    unique: true,
  })
  type: string;

  @Column('int', { name: 'status', comment: '状态（1正常 2停用）' })
  status: DictStatusEnum;

  @Column('varchar', {
    name: 'remark',
    comment: '备注',
    length: 500,
    nullable: true,
  })
  remark: string | null;
}
