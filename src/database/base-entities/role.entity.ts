import { Entity, Column } from 'typeorm';
import { BaseDO } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 角色实体，对齐 RuoYi-Vue-Pro 的 system_roles 表
 */
@Entity('system_roles')
export class RoleDO extends BaseDO {
  @ApiProperty({ description: '角色名称' })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 30,
    comment: '角色名称',
  })
  name: string;

  @ApiProperty({ description: '角色权限字符串' })
  @Column({
    name: 'code',
    type: 'varchar',
    length: 100,
    comment: '角色权限字符串',
  })
  code: string;

  @ApiProperty({ description: '显示顺序' })
  @Column({
    name: 'sort',
    type: 'int',
    comment: '显示顺序',
  })
  sort: number;

  @ApiProperty({ description: '数据范围', enum: [1, 2, 3, 4, 5] })
  @Column({
    name: 'data_scope',
    type: 'smallint',
    default: 1,
    comment:
      '数据范围（1：全部数据权限 2：自定数据权限 3：本部门数据权限 4：本部门及以下数据权限）',
  })
  dataScope: number;

  @ApiProperty({ description: '数据范围(指定部门数组)', required: false })
  @Column({
    name: 'data_scope_dept_ids',
    type: 'varchar',
    length: 500,
    default: '',
    comment: '数据范围(指定部门数组)',
    transformer: {
      to: (value: number[]) => value?.join(',') || '',
      from: (value: string) => (value ? value.split(',').map(Number) : []),
    },
  })
  dataScopeDeptIds?: number[];

  @ApiProperty({ description: '角色状态', enum: [0, 1] })
  @Column({
    name: 'status',
    type: 'smallint',
    comment: '角色状态（0正常 1停用）',
  })
  status: number;

  @ApiProperty({ description: '角色类型', enum: [1, 2] })
  @Column({
    name: 'type',
    type: 'smallint',
    comment: '角色类型（1内置角色 2自定义角色）',
  })
  type: number;

  @ApiProperty({ description: '备注', required: false })
  @Column({
    name: 'remark',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '备注',
  })
  remark?: string;
}
