import { Entity, Column } from 'typeorm';
import { BaseDO } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户角色关联实体，对齐 RuoYi-Vue-Pro 的 system_user_roles 表
 */
@Entity('system_user_roles')
export class UserRoleDO extends BaseDO {
  @ApiProperty({ description: '用户ID' })
  @Column({
    name: 'user_id',
    type: 'bigint',
    comment: '用户ID',
  })
  userId: number;

  @ApiProperty({ description: '角色ID' })
  @Column({
    name: 'role_id',
    type: 'bigint',
    comment: '角色ID',
  })
  roleId: number;
}
