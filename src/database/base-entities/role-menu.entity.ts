import { Entity, Column } from 'typeorm';
import { BaseDO } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 角色菜单关联实体，对齐 RuoYi-Vue-Pro 的 system_role_menus 表
 */
@Entity('system_role_menus')
export class RoleMenuDO extends BaseDO {
  @ApiProperty({ description: '角色ID' })
  @Column({
    name: 'role_id',
    type: 'bigint',
    comment: '角色ID',
  })
  roleId: number;

  @ApiProperty({ description: '菜单ID' })
  @Column({
    name: 'menu_id',
    type: 'bigint',
    comment: '菜单ID',
  })
  menuId: number;
}
