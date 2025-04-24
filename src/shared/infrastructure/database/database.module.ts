import { DynamicModule, Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { EnvConfigModule } from '../env-config/env-config.module';
import { EnvConfigService } from '../env-config/env-config.service';
import { PrismaClient } from '@prisma/client';

@Global()
@Module({
  imports: [EnvConfigModule.forRoot()],
  providers: [EnvConfigService, PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {
  static forTest(prismaClient: PrismaClient): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: PrismaService,
          useFactory: (...args): PrismaService => prismaClient as PrismaService,
        },
      ],
    };
  }
}
