# @protocolo-aberto-brasileiro-integracao/pabip-sdk

Camada de protocolo do PABIP em TypeScript: DTOs/validação do envelope de analíticos, clientes HTTP tipados para os eixos sensor-nodes/vídeo/analíticos, e os tipos de contrato de driver de output-sink.

Não inclui autenticação, rate limiting, circuit breaker ou qualquer estado operacional — isso é exclusivo de quem opera um gateway PABIP. Documentação completa do protocolo e do gateway vive fora deste repositório.

## Instalação

Este pacote é publicado no GitHub Packages, não no registro público do npm. O registro do GitHub exige autenticação mesmo para pacotes de repositórios públicos — quem for instalar precisa de um [personal access token](https://github.com/settings/tokens) do GitHub com escopo `read:packages`.

Adicione ao `.npmrc` do seu projeto (não do pacote):

```
@protocolo-aberto-brasileiro-integracao:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

E então instale normalmente:

```
npm install @protocolo-aberto-brasileiro-integracao/pabip-sdk
```

## Uso

Este pacote depende em tempo de execução de `axios`, `class-validator`, `class-transformer` e `reflect-metadata` (peer dependencies) — instale-as no projeto consumidor. Se seu projeto ainda não importa `reflect-metadata` em algum ponto de bootstrap, adicione `import 'reflect-metadata'` antes de usar as DTOs.
