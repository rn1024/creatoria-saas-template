import { Entity, Column } from 'typeorm';
import { BaseDO } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 部门实体，对齐 RuoYi-Vue-Pro 的 system_dept 表
 */
@Entity('system_dept')
export class DeptDO extends BaseDO {
  @ApiProperty({ description: '部门名称' })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 30,
    comment: '部门名称',
  })
  name: string;

  @ApiProperty({ description: '父部门ID' })
  @Column({
    name: 'parent_id',
    type: 'bigint',
    default: 0,
    comment: '父部门ID',
  })
  parentId: number;

  @ApiProperty({ description: '显示顺序' })
  @Column({
    name: 'sort',
    type: 'int',
    comment: '显示顺序',
  })
  sort: number;

  @ApiProperty({ description: '负责人' })
  @Column({
    name: 'leader_user_id',
    type: 'bigint',
    nullable: true,
    comment: '负责人',
  })
  leaderUserId?: number;

  @ApiProperty({ description: '联系电话' })
  @Column({
    name: 'phone',
    type: 'varchar',
    length: 11,
    nullable: true,
    comment: '联系电话',
  })
  phone?: string;

  @ApiProperty({ description: '邮箱' })
  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '邮箱',
  })
  email?: string;

  @ApiProperty({ description: '部门状态', enum: [0, 1] })
  @Column({
    name: 'status',
    type: 'smallint',
    comment: '部门状态（0正常 1停用）',
  })
  status: number;
}
