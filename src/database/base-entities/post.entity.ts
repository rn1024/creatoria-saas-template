import { Entity, Column } from 'typeorm';
import { BaseDO } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 岗位实体，对齐 RuoYi-Vue-Pro 的 system_post 表
 */
@Entity('system_post')
export class PostDO extends BaseDO {
  @ApiProperty({ description: '岗位编码' })
  @Column({
    name: 'code',
    type: 'varchar',
    length: 64,
    comment: '岗位编码',
  })
  code: string;

  @ApiProperty({ description: '岗位名称' })
  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    comment: '岗位名称',
  })
  name: string;

  @ApiProperty({ description: '显示顺序' })
  @Column({
    name: 'sort',
    type: 'int',
    comment: '显示顺序',
  })
  sort: number;

  @ApiProperty({ description: '岗位状态', enum: [0, 1] })
  @Column({
    name: 'status',
    type: 'smallint',
    comment: '岗位状态（0正常 1停用）',
  })
  status: number;

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
