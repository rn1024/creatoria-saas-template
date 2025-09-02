# Creatoria SaaS Application

This project was scaffolded with [Creatoria CLI](https://github.com/rn1024/creatoria-cli).

## Description

A modular SaaS application built with NestJS framework.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Module Management

Add new modules to your application:

```bash
# Add a module
$ saas add system
$ saas add crm
$ saas add erp

# List installed modules
$ saas list

# Remove a module
$ saas remove system
```

## Database

```bash
# Run migrations
$ saas db migrate

# Seed database
$ saas db seed

# Reset database
$ saas db reset
```

## Configuration

The application uses environment variables for configuration. Copy `.env.example` to `.env` and update the values:

```bash
$ cp .env.example .env
```

## License

MIT