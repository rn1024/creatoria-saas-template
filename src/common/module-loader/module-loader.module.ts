import { Module, DynamicModule, Global } from '@nestjs/common';
import { ModuleLoaderService } from './module-loader.service';

@Global()
@Module({})
export class ModuleLoaderModule {
  static async forRootAsync(): Promise<DynamicModule> {
    const moduleLoaderService = new ModuleLoaderService();
    const dynamicModules = await moduleLoaderService.loadModules();

    return {
      module: ModuleLoaderModule,
      imports: dynamicModules,
      providers: [ModuleLoaderService],
      exports: [ModuleLoaderService],
    };
  }
}