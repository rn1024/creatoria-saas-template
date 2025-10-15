import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 基础实体类，对应 RuoYi-Vue-Pro 的 BaseDO
 */
export abstract class BaseDO {
  @ApiProperty({ description: '主键ID' })
  @PrimaryGeneratedColumn({ name: 'id', comment: '主键ID' })
  id: number;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({
    name: 'create_time',
    comment: '创建时间',
    type: 'timestamp',
  })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({
    name: 'update_time',
    comment: '更新时间',
    type: 'timestamp',
  })
  updateTime: Date;

  @ApiProperty({ description: '创建者', required: false })
  @Column({
    name: 'creator',
    comment: '创建者',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  creator?: string;

  @ApiProperty({ description: '更新者', required: false })
  @Column({
    name: 'updater',
    comment: '更新者',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  updater?: string;

  @ApiProperty({ description: '是否删除', required: false })
  @Column({
    name: 'deleted',
    comment: '是否删除',
    type: 'boolean',
    default: false,
  })
  deleted: boolean;

  @ApiProperty({ description: '租户编号', required: false })
  @Column({
    name: 'tenant_id',
    comment: '租户编号',
    type: 'bigint',
    nullable: true,
  })
  tenantId?: number;
}
