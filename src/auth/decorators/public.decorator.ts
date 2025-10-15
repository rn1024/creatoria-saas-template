import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 标记接口为公开，不需要认证
 * 对齐 RuoYi-Vue-Pro 的 @Anonymous 注解
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
