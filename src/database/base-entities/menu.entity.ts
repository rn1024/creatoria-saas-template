import { Entity, Column } from 'typeorm';
import { BaseDO } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 菜单实体，对齐 RuoYi-Vue-Pro 的 system_menus 表
 */
@Entity('system_menus')
export class MenuDO extends BaseDO {
  @ApiProperty({ description: '菜单名称' })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    comment: '菜单名称',
  })
  name: string;

  @ApiProperty({ description: '权限标识', required: false })
  @Column({
    name: 'permission',
    type: 'varchar',
    length: 100,
    default: '',
    comment: '权限标识',
  })
  permission?: string;

  @ApiProperty({ description: '菜单类型', enum: [1, 2, 3] })
  @Column({
    name: 'type',
    type: 'smallint',
    comment: '菜单类型（1目录 2菜单 3按钮）',
  })
  type: number;

  @ApiProperty({ description: '显示顺序' })
  @Column({
    name: 'sort',
    type: 'int',
    default: 0,
    comment: '显示顺序',
  })
  sort: number;

  @ApiProperty({ description: '父菜单ID' })
  @Column({
    name: 'parent_id',
    type: 'bigint',
    default: 0,
    comment: '父菜单ID',
  })
  parentId: number;

  @ApiProperty({ description: '路由地址', required: false })
  @Column({
    name: 'path',
    type: 'varchar',
    length: 200,
    default: '',
    comment: '路由地址',
  })
  path?: string;

  @ApiProperty({ description: '菜单图标', required: false })
  @Column({
    name: 'icon',
    type: 'varchar',
    length: 100,
    default: '#',
    comment: '菜单图标',
  })
  icon?: string;

  @ApiProperty({ description: '组件路径', required: false })
  @Column({
    name: 'component',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '组件路径',
  })
  component?: string;

  @ApiProperty({ description: '组件名字', required: false })
  @Column({
    name: 'component_name',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '组件名字',
  })
  componentName?: string;

  @ApiProperty({ description: '菜单状态', enum: [0, 1] })
  @Column({
    name: 'status',
    type: 'smallint',
    default: 0,
    comment: '菜单状态（0正常 1停用）',
  })
  status: number;

  @ApiProperty({ description: '是否显示', required: false })
  @Column({
    name: 'visible',
    type: 'boolean',
    default: true,
    comment: '是否显示',
  })
  visible?: boolean;

  @ApiProperty({ description: '是否缓存', required: false })
  @Column({
    name: 'keep_alive',
    type: 'boolean',
    default: true,
    comment: '是否缓存',
  })
  keepAlive?: boolean;

  @ApiProperty({ description: '是否总是显示', required: false })
  @Column({
    name: 'always_show',
    type: 'boolean',
    default: true,
    comment: '是否总是显示',
  })
  alwaysShow?: boolean;
}
