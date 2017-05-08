+++
categories = ["blog", "pt-br", "security"]
date = "2017-05-08T12:54:17-02:00"
draft = false
image = "img/posts/password.jpg"
tags = ["password", "php", "coderockr"]
title = "Como lidar com senhas inseguras em projetos legados"

+++

# Como lidar com senhas inseguras em projetos legados

Aqui na [Coderockr](http://coderockr.com/) nós eventualmente nos deparamos com sistemas legados e muitas vezes inseguros. Um dos problemas mais comuns é a utilização de funções hash como MD5, SHA1, SHA-256 em senhas. O uso dessas funções apresenta alguns riscos que as aplicações não deveriam estar correndo, mas antes de abordar as soluções, vamos ver porque o uso deses algoritmos de hash representam um risco de segurança.
Por que funções hash não devem ser usadas em senhas?
Basicamente funções hash foram criadas para verificar a integridade de dados de forma eficiente e no menor tempo possível, sendo um grande problema quando estamos lidando com senhas pois não fornecem nenhuma defesa contra ataques de força bruta.
Se você acha que isso não é algo tão importante ou não sabia disso, o [Jeff Atwood](https://blog.codinghorror.com/about-me/) fez um [post](https://blog.codinghorror.com/speed-hashing/) bem detalhado sobre o assunto em 2012.
Agora que sabemos do problema na utilização dessas funções podemos ir para as soluções:

## Solução 1 — Pare de usar senhas!

> ALTER TABLE users DROP COLUMN password;

Senhas estão obsoletas a um bom tempo e podem/devem ser substituídas por mecanismos possivelmente mais seguros. Muitas empresas como Slack, Uber, Twitter e WhatsApp já aderiram a essa prática.
Ficou com medo de fazer uma mudança tão grande? Bom, você deveria ficar com medo é de ser um dos responsáveis por garantir a segurança dessas informações!

Embora essa opção possa dar trabalho para se utilizar em projetos que já estejam em produção é possivelmente mais econômico utilizar serviços de terceiros ao invés de manter uma solução você mesmo!

Algumas opções que podem ser usadas:

+ Auth0 — ([Auth0](https://auth0.com/) é uma empresa que prove diversos produtos e serviço que relacionados a autenticação e autorização e facilitam muito a sua vida com segurança.
+ Keycloak —  [Keycloak](http://www.keycloak.org/) é um sistema open source para gerenciamento de acesso e usuários, é o melhor identity provider open source que eu já encontrei e é mantido pela Redhat.
+ Usar uma biblioteca como a [OmniAuth](https://github.com/omniauth/omniauth) e utilizar algums dos provedores de login.
+ Account Kit - O [Account Kit](https://developers.facebook.com/docs/accountkit) é um produto do Facebook para prover registro e login de usuários através de sms ou email, sem a necessidade de senhas e com o foco principal em aplicativos mobile.

## Solução 2 — Migrar as senhas para uma solução mais segura

Existem algumas abordagens utilizadas para migrar as senhas, por exemplo:
Podemos forçar todos os usuários a recuperarem as senhas e utilizar o novo algoritmo quando a nova senha for utilizada. Embora está opção não seja recomendável.

Outra opção é ir utilizando o novo algoritmo nos novos usuários e nos usuários antigos conforme eles forem se logando, essa solução é ruim pois os usuários inativos continuarão com hashes inseguros se surgir um leak da sua base de dados. Podemos resolver isso removendo a senha de usuários que não se logam a muito tempo (é muito provável que eles não voltem a usar o sistema ou não se lembrem da senha quando voltarem).
Para mim a melhor solução nesse caso é uma abordagem um pouco diferente:

Vamos utilizar o resultado do hash antigo como entrada para o novo algoritmo de senhas, dessa forma precisamos apenas fazer a migração dos hashes antigos para o novo e os usuários não irão perceber!
Se você ficou interessado nessa abordagem o pessoal da [Paragon Initiative](https://paragonie.com/blog/2016/02/how-safely-store-password-in-2016#legacy-hashes) possuí um post bem detalhado sobre essa prática e quais algoritmos de password hash devem ser utilizados.