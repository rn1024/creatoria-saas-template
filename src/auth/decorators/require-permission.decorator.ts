import { SetMetadata } from '@nestjs/common';

export const REQUIRE_PERMISSION_KEY = 'requirePermission';

/**
 * 权限装饰器，对齐 RuoYi-Vue-Pro 的 @PreAuthorize
 *
 * @param permission 权限标识，如 'system:user:query'
 *
 * 使用示例：
 * @RequirePermission('system:user:query')
 * @Get('/page')
 * getUserPage() {}
 *
 * 对应 RuoYi-Vue-Pro 中的：
 * @PreAuthorize(\"@ss.hasPermission('system:user:query')\")
 * @GetMapping(\"/page\")
 * public CommonResult<PageResult<UserRespVO>> getUserPage() {}
 */
export const RequirePermission = (permission: string) =>
  SetMetadata(REQUIRE_PERMISSION_KEY, permission);
