# @protocolo-aberto-brasileiro-integracao/pabip-sdk

Camada de protocolo do PABIP em TypeScript: DTOs/validação do envelope de analíticos, clientes HTTP tipados para os eixos sensor-nodes/vídeo/analíticos, e os tipos de contrato de driver de output-sink.

Não inclui autenticação, rate limiting, circuit breaker ou qualquer estado operacional — isso é exclusivo de quem opera um gateway PABIP. Documentação completa do protocolo e do gateway vive fora deste repositório.

## Instalação

```
npm install @protocolo-aberto-brasileiro-integracao/pabip-sdk
```

Publicado no [registro público do npm](https://www.npmjs.com/package/@protocolo-aberto-brasileiro-integracao/pabip-sdk) — sem autenticação necessária para instalar.

O pacote também é publicado no GitHub Packages (mesmo scope, mesma versão), mas esse registro exige um [personal access token](https://github.com/settings/tokens) do GitHub com escopo `read:packages` mesmo para repositórios públicos. Use o npm público a menos que tenha um motivo específico para preferir o GitHub Packages.

## Uso

Este pacote depende em tempo de execução de `axios`, `class-validator`, `class-transformer` e `reflect-metadata` (peer dependencies) — instale-as no projeto consumidor. Se seu projeto ainda não importa `reflect-metadata` em algum ponto de bootstrap, adicione `import 'reflect-metadata'` antes de usar as DTOs.
