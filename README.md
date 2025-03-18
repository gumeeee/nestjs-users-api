<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
<p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
<a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
<a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

This project is a NestJS application following the Clean Architecture principles.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Project Structure

```bash
├── .editorconfig
├── .env.example
├── .gitignore
├── .prettierrc
├── README.md
├── eslint.config.mjs
├── jest.config.ts
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── src
    ├── app.controller.spec.ts
    ├── app.controller.ts
    ├── app.module.ts
    ├── app.service.ts
    ├── main.ts
    ├── shared
    │   ├── domain
    │   │   ├── entity
    │   │   │   ├── __tests__
    │   │   │   │   └── unit
    │   │   │   │   │   └── entity.spec.ts
    │   │   │   ├── entity.ts
    │   │   │   └── validators
    │   │   │   │   ├── __tests__
    │   │   │   │       ├── integration
    │   │   │   │       │   └── class-validator-fields.int.spec.ts
    │   │   │   │       └── unit
    │   │   │   │       │   └── class-validator-fields.spec.ts
    │   │   │   │   ├── class-validator-fields.ts
    │   │   │   │   └── validator-fields.interface.ts
    │   │   ├── errors
    │   │   │   ├── conflict-error.ts
    │   │   │   ├── not-found-error.ts
    │   │   │   └── validation-error.ts
    │   │   └── repositories
    │   │   │   ├── __tests__
    │   │   │       └── unit
    │   │   │       │   └── in-memory.repository.spec.ts
    │   │   │   ├── in-memory.repository.ts
    │   │   │   └── repository-contracts.ts
    │   └── infrastructure
    │   │   └── env-config
    │   │       ├── __tests__
    │   │           └── unit
    │   │           │   └── env-config.service.spec.ts
    │   │       ├── env-config-interface.ts
    │   │       ├── env-config.module.ts
    │   │       └── env-config.service.ts
    └── users
    │   ├── domain
    │       ├── entities
    │       │   ├── __tests__
    │       │   │   ├── integration
    │       │   │   │   └── user.entity.int-spec.ts
    │       │   │   └── unit
    │       │   │   │   └── user.entity.spec.ts
    │       │   └── user.entity.ts
    │       ├── repositories
    │       │   └── user.repository.ts
    │       ├── testing
    │       │   └── helpers
    │       │   │   └── user-data-builder.ts
    │       └── validators
    │       │   ├── __tests__
    │       │       └── unit
    │       │       │   └── user.validator.spec.ts
    │       │   └── user.validator.ts
    │   └── infrastructure
    │       ├── database
    │           └── in-memory
    │           │   └── repositories
    │           │       └── user-in-memory.repository.ts
    │       ├── dto
    │           ├── create-user.dto.ts
    │           └── update-user.dto.ts
    │       ├── users.controller.spec.ts
    │       ├── users.controller.ts
    │       ├── users.module.ts
    │       ├── users.service.spec.ts
    │       └── users.service.ts
├── test
    └── jest-e2e.json
├── tsconfig.build.json
└── tsconfig.json
```

## Configuration

The project uses `ts-jest` for testing. The configuration can be found in `jest.config.ts`:

```ts
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};
```

## License

Nest is [MIT licensed](LICENSE).
