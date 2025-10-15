import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseDO } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 通知公告类型枚举
 */
export enum NoticeTypeEnum {
  NOTICE = 1, // 通知
  ANNOUNCEMENT = 2, // 公告
}

/**
 * 通用状态枚举
 */
export enum CommonStatusEnum {
  ENABLE = 0, // 开启
  DISABLE = 1, // 关闭
}

/**
 * 通知公告实体类
 */
@Entity('system_notice')
export class NoticeDO extends BaseDO {
  @ApiProperty({ description: '公告ID' })
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  declare id: number;

  @ApiProperty({ description: '公告标题' })
  @Column('varchar', { name: 'title', comment: '公告标题', length: 50 })
  title: string;

  @ApiProperty({ description: '公告类型' })
  @Column('int', { name: 'type', comment: '公告类型' })
  type: NoticeTypeEnum;

  @ApiProperty({ description: '公告内容' })
  @Column('text', { name: 'content', comment: '公告内容' })
  content: string;

  @ApiProperty({ description: '公告状态' })
  @Column('int', { name: 'status', comment: '公告状态' })
  status: CommonStatusEnum;
}
