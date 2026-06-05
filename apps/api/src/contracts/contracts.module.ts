import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { ContractsWebhookController } from './contracts.webhook.controller';
import {
  CONTRACT_GATEWAY,
  type ContractGateway,
} from './gateway/contract-gateway.interface';
import { MockContractGateway } from './gateway/mock-contract.gateway';
import { UCanSignContractGateway } from './gateway/ucansign-contract.gateway';
import { UCanSignAuthService } from './ucansign-auth.service';
import { UCanSignClient } from './ucansign.client';

@Module({
  imports: [HttpModule],
  controllers: [ContractsController, ContractsWebhookController],
  providers: [
    ContractsService,
    UCanSignClient,
    UCanSignAuthService,
    MockContractGateway,
    UCanSignContractGateway,
    {
      provide: CONTRACT_GATEWAY,
      useFactory: (
        config: ConfigService,
        mock: MockContractGateway,
        real: UCanSignContractGateway,
      ): ContractGateway => {
        const kind = (
          config.get<string>('CONTRACT_GATEWAY') ?? 'mock'
        ).toLowerCase();
        return kind === 'ucansign' ? real : mock;
      },
      inject: [ConfigService, MockContractGateway, UCanSignContractGateway],
    },
  ],
  exports: [ContractsService],
})
export class ContractsModule {}
