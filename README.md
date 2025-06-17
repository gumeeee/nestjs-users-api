# NestJS Clean Architecture

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[![NestJS](https://img.shields.io/badge/NestJS-EA2845?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## 📋 Descrição

Este projeto é uma aplicação NestJS que implementa os princípios da Clean Architecture, oferecendo uma estrutura organizada e escalável para desenvolvimento de aplicações backend. O projeto segue as melhores práticas de desenvolvimento, incluindo testes unitários, de integração e e2e.

## 🚀 Tecnologias

- [NestJS](https://nestjs.com/) - Framework Node.js progressivo
- [TypeScript](https://www.typescriptlang.org/) - Superset JavaScript tipado
- [Prisma](https://www.prisma.io/) - ORM moderno para Node.js e TypeScript
- [Jest](https://jestjs.io/) - Framework de testes
- [Docker](https://www.docker.com/) - Plataforma de containerização
- [PNPM](https://pnpm.io/) - Gerenciador de pacotes rápido e eficiente

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture, dividido em três camadas principais:

### 1. Domain Layer
- Contém a lógica de negócio central
- Entidades e objetos de valor
- Interfaces dos repositórios
- Independente de frameworks e infraestrutura

### 2. Application Layer
- Regras de negócio específicas da aplicação
- Casos de uso
- DTOs
- Orquestra a camada de domínio

### 3. Infrastructure Layer
- Implementações concretas
- Acesso ao banco de dados
- Controllers NestJS
- Serviços externos

## 📁 Estrutura do Projeto

```
src/
├── shared/           # Código compartilhado entre módulos
│   ├── application/  # DTOs e casos de uso compartilhados
│   ├── domain/       # Entidades e interfaces compartilhadas
│   └── infrastructure/ # Implementações compartilhadas
├── users/           # Módulo de usuários
│   ├── application/ # Casos de uso e DTOs
│   ├── domain/      # Entidades e interfaces
│   └── infrastructure/ # Implementações
└── main.ts          # Ponto de entrada da aplicação
```

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js (versão LTS recomendada)
- PNPM
- Docker e Docker Compose

### Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Inicie o banco de dados com Docker:
```bash
docker-compose up -d
```

## 🚀 Executando o Projeto

### Desenvolvimento
```bash
pnpm run start:dev
```

### Produção
```bash
pnpm run build
pnpm run start:prod
```

## 🧪 Testes

### Testes Unitários
```bash
pnpm run test
```

### Testes de Integração
```bash
pnpm run test:int
```

### Testes E2E
```bash
pnpm run test:e2e
```

### Cobertura de Testes
```bash
pnpm run test:cov
```

## 📦 Docker

### Construir a imagem
```bash
docker build -t nestjs-clean-arch .
```

### Executar com Docker Compose
```bash
docker-compose up
```

## 📚 Documentação da API

A documentação da API está disponível em `/api` quando o servidor estiver em execução.

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- Seu Nome - [@gumeeee](https://github.com/gumeeee)

## 🙏 Agradecimentos

- [NestJS](https://nestjs.com/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Prisma](https://www.prisma.io/)
