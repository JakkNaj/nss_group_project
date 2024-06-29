# INTRANET CHATTING APP

# NSS - GROUP PROJECT

## Členové týmu

Projekt se skládá z:<br/>
[Le Tobias](https://www.linkedin.com/in/tobias-le-01b306233/)<br/>
[Jakub Najman](https://www.linkedin.com/in/jakub-najman8/)<br/>
[Adam Schuppler](https://www.linkedin.com/in/adamschuppler/)<br/>
[Le Vanessa](https://www.linkedin.com/in/vanessa-le-845624268/)<br/>

## Dokumentace

[Link](https://docs.google.com/document/d/1qMZbQ6N5mLhj7hgiptDnqChFwkZ9lIkZMTy_L5SVObQ/edit)

## Spuštění aplikace
- Clone the repository
- Navigate to the project root directory
- Run 'mvn clean install' in the root directory
  - if mvn clean install does not work, try running mvn idea:idea
- Run `docker-compose up`
- Run 'npm ci' in the /frontend directory
- Run 'npm run start' in the /frontend directory
- Start the chat application and any other component you want to use (bear the dependencies of the components in mind)

## Tabulka požadavků

| Požadavek          | Použití                                                                                                                                                                                                                                                               |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Vhodná technologie | Java, Spring Boot, React                                                                                                                                                                                                                                              |
| Společná DB        | PostgreSQL pro uživatele, MongoDB pro uživatelské detaily, Elasticsearch pro události v chatu                                                                                                                                                                         |
| Cache              | @Cacheable (getUserByUserid v UsersService.java) - pro cachování dat o uživatelích                                                                                                                                                                                    |
| Messaging princip  | Kafka na události v chatu                                                                                                                                                                                                                                             |
| Security           | Autorizace přes JSON webtoken (viz api gateway)                                                                                                                                                                                                                       |
| Interceptors       | Security (viz modul API Gateway)                                                                                                                                                                                                                                      |
| REST               | Komunikace mezi moduly                                                                                                                                                                                                                                                |
| Výběr vhodné architektury | Model driven architecture (viz dokumentace)                                                                                                                                                                                                                           |
| Inicializační postup | Viz výše                                                                                                                                                                                                                                                              |
| Využití elasticsearch | Ano (ukládání událostí z chatu)                                                                                                                                                                                                                                       |
| Použití alespoň 5 design patternu | -Producer (KafkaChatMessageProducerService), consumer (KafkaChatListenerService), <br/>inversion of control (throughout the project - java), <br/>dependency injection (throughout the project - java), <br/>fasáda (UserEntityDto), <br/>proxy (ChatController), ad. |
| Za každého člena týmu 2 UC | Ano (viz dokumentace)                                                                                                                                                                                                                                                 |
