import {
  BadRequestException,
  type ExecutionContext,
  Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { createZodValidationPipe } from 'nestjs-zod';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { ZodError } from 'zod';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { ContractsModule } from './contracts/contracts.module';
import { HealthModule } from './health/health.module';
import { MatchingModule } from './matching/matching.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

const ZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: unknown) => {
    if (!(error instanceof ZodError)) {
      return new BadRequestException(['body: Invalid request payload']);
    }

    return new BadRequestException(
      error.issues.map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join('.') : 'body';
        return `${path}: ${issue.message}`;
      }),
    );
  },
});

const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';

function requestPath(context: ExecutionContext): string {
  const req = context
    .switchToHttp()
    .getRequest<{ path?: string; url?: string }>();
  return req.path ?? req.url ?? '';
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      pinoHttp: {
        enabled: !isTest,
        level: isTest ? 'silent' : isProd ? 'info' : 'debug',
        transport:
          !isProd && !isTest
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
        genReqId: (req, res) => {
          const incoming = req.headers['x-request-id'];
          const requestId = Array.isArray(incoming) ? incoming[0] : incoming;
          if (requestId && /^[A-Za-z0-9._:-]{8,128}$/.test(requestId)) {
            res.setHeader('X-Request-Id', requestId);
            return requestId;
          }

          const generated = randomUUID();
          res.setHeader('X-Request-Id', generated);
          return generated;
        },
        redact: {
          paths: [
            'req.body.email',
            'req.body.password',
            'req.body.passwordConfirm',
            'req.body.confirmPassword',
            'req.body.currentPassword',
            'req.body.newPassword',
            'req.body.token',
            'req.body.accessToken',
            'req.body.refreshToken',
            'req.headers.cookie',
            'req.headers.authorization',
            'req.headers["x-api-key"]',
            'req.headers["x-csrf-token"]',
            'res.headers.set-cookie',
            '*.token',
          ],
          censor: '[Redacted]',
          remove: false,
        },
        autoLogging: {
          ignore: (req) =>
            req.url === '/health' ||
            req.url === '/health/db' ||
            req.url === '/docs-json' ||
            Boolean(req.url?.startsWith('/docs/')),
        },
        customLogLevel: (_req, res, err) => {
          if (err || res.statusCode >= 500) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: seconds(60),
          limit: 30,
          skipIf: (context) => requestPath(context) === '/matching/recommend',
        },
        {
          name: 'expensive',
          ttl: seconds(60),
          limit: 5,
          skipIf: (context) => requestPath(context) !== '/matching/recommend',
        },
        {
          name: 'auth-strict',
          ttl: seconds(60),
          limit: 5,
          skipIf: () => true,
        },
      ],
    }),
    PrismaModule,
    AuthModule,
    MatchingModule,
    UsersModule,
    CompaniesModule,
    ContractsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
