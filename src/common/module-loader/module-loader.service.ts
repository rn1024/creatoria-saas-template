import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class ModuleLoaderService {
  private readonly logger = new Logger(ModuleLoaderService.name);
  private readonly modulesPath = path.join(process.cwd(), 'modules');
  private readonly modulesConfigPath = path.join(process.cwd(), 'modules.json');

  async loadModules(): Promise<any[]> {
    const modules: any[] = [];

    try {
      // Check if modules config exists
      if (!await fs.pathExists(this.modulesConfigPath)) {
        this.logger.log('No modules.json found, skipping module loading');
        return modules;
      }

      const modulesConfig = await fs.readJSON(this.modulesConfigPath);
      const enabledModules = modulesConfig.modules || [];

      for (const moduleName of enabledModules) {
        try {
          const modulePath = path.join(this.modulesPath, moduleName);
          
          if (!await fs.pathExists(modulePath)) {
            this.logger.warn(`Module ${moduleName} directory not found`);
            continue;
          }

          // Try to load the module
          const moduleIndexPath = path.join(modulePath, 'index.ts');
          const moduleMainPath = path.join(modulePath, `${moduleName}.module.ts`);
          
          let moduleClass;
          
          if (await fs.pathExists(moduleIndexPath)) {
            moduleClass = await import(moduleIndexPath);
          } else if (await fs.pathExists(moduleMainPath)) {
            moduleClass = await import(moduleMainPath);
          } else {
            this.logger.warn(`Module ${moduleName} entry point not found`);
            continue;
          }

          // Get the default export or the module class
          const ModuleClass = moduleClass.default || moduleClass[Object.keys(moduleClass)[0]];
          
          if (ModuleClass) {
            modules.push(ModuleClass);
            this.logger.log(`Module ${moduleName} loaded successfully`);
          }
        } catch (error) {
          this.logger.error(`Failed to load module ${moduleName}:`, error);
        }
      }
    } catch (error) {
      this.logger.error('Failed to load modules:', error);
    }

    return modules;
  }

  async getLoadedModules(): Promise<string[]> {
    try {
      if (!await fs.pathExists(this.modulesConfigPath)) {
        return [];
      }

      const modulesConfig = await fs.readJSON(this.modulesConfigPath);
      return modulesConfig.modules || [];
    } catch (error) {
      this.logger.error('Failed to get loaded modules:', error);
      return [];
    }
  }

  async isModuleLoaded(moduleName: string): Promise<boolean> {
    const loadedModules = await this.getLoadedModules();
    return loadedModules.includes(moduleName);
  }
}