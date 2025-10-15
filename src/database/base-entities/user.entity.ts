import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseDO } from '../base.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 用户实体，对齐 RuoYi-Vue-Pro 的 system_users 表
 */
@Entity('system_users')
export class UserDO extends BaseDO {
  @ApiProperty({ description: '用户账号' })
  @Column({
    name: 'username',
    type: 'varchar',
    length: 30,
    unique: true,
    comment: '用户账号',
  })
  username: string;

  @ApiProperty({ description: '用户昵称' })
  @Column({
    name: 'nickname',
    type: 'varchar',
    length: 30,
    comment: '用户昵称',
  })
  nickname: string;

  @ApiProperty({ description: '用户邮箱', required: false })
  @Column({
    name: 'email',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '用户邮箱',
  })
  email?: string;

  @ApiProperty({ description: '手机号码', required: false })
  @Column({
    name: 'mobile',
    type: 'varchar',
    length: 11,
    nullable: true,
    comment: '手机号码',
  })
  mobile?: string;

  @ApiProperty({ description: '用户性别', enum: [0, 1, 2] })
  @Column({
    name: 'sex',
    type: 'smallint',
    default: 0,
    comment: '用户性别（0未知 1男 2女）',
  })
  sex: number;

  @ApiProperty({ description: '头像地址', required: false })
  @Column({
    name: 'avatar',
    type: 'varchar',
    length: 512,
    nullable: true,
    comment: '头像地址',
  })
  avatar?: string;

  @ApiProperty({ description: '密码' })
  @Column({
    name: 'password',
    type: 'varchar',
    length: 100,
    comment: '密码',
    select: false, // 默认不查询密码字段
  })
  password: string;

  @ApiProperty({ description: '账号状态', enum: [0, 1] })
  @Column({
    name: 'status',
    type: 'smallint',
    default: 0,
    comment: '账号状态（0正常 1停用）',
  })
  status: number;

  @ApiProperty({ description: '部门ID', required: false })
  @Column({
    name: 'dept_id',
    type: 'bigint',
    nullable: true,
    comment: '部门ID',
  })
  deptId?: number;

  @ApiProperty({ description: '岗位ID数组', type: [Number], required: false })
  @Column({
    name: 'post_ids',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '岗位ID，多个用逗号分隔',
    transformer: {
      to: (value: number[]) => value?.join(',') || null,
      from: (value: string) => (value ? value.split(',').map(Number) : []),
    },
  })
  postIds?: number[];

  @ApiProperty({ description: '备注', required: false })
  @Column({
    name: 'remark',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '备注',
  })
  remark?: string;

  @ApiProperty({ description: '最后登录IP', required: false })
  @Column({
    name: 'login_ip',
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '最后登录IP',
  })
  loginIp?: string;

  @ApiProperty({ description: '最后登录时间', required: false })
  @Column({
    name: 'login_date',
    type: 'timestamp',
    nullable: true,
    comment: '最后登录时间',
  })
  loginDate?: Date;
}
