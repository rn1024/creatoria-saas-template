import { BaseDO } from '@app/database/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum DictDataStatusEnum {
  ENABLE = 0, // 启用
  DISABLE = 1, // 禁用
}

@Entity('system_dict_data')
export class DictDataDO extends BaseDO {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  declare id: number;

  @Column('int', { name: 'sort', comment: '字典排序' })
  sort: number;

  @Column('varchar', { name: 'label', comment: '字典标签', length: 100 })
  label: string;

  @Column('varchar', { name: 'value', comment: '字典键值', length: 100 })
  value: string;

  @Column('varchar', { name: 'dict_type', comment: '字典类型', length: 100 })
  dictType: string;

  @Column('int', { name: 'status', comment: '状态（1正常 2停用）' })
  status: DictDataStatusEnum;

  @Column('varchar', {
    name: 'color_type',
    comment: '颜色类型',
    length: 100,
    nullable: true,
  })
  colorType: string | null;

  @Column('varchar', {
    name: 'css_class',
    comment: 'css样式',
    length: 100,
    nullable: true,
  })
  cssClass: string | null;

  @Column('varchar', {
    name: 'remark',
    comment: '备注',
    length: 500,
    nullable: true,
  })
  remark: string | null;
}
