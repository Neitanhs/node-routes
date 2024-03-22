// import { createServer } from "node:http";
// //request = obter dados da requisição pro meu servidor HTTP/API
// //Ex: podemos imaginar que estamos criando uma funcionalidade de criação de novo usuário, então dentro do request eu vou buscar..
// //As informações necessárias (Email, senha e etc)

// //Já o response, vai ser o objeto que eu vou utilizar para dar uma resposta para quem ta chamando a API

// const server = createServer((request, response) => {
//   //   console.log("oi");

//   //Método de write da função response
//   response.write("Salve");

//   //A requisição foi finalizada
//   return response.end();
// });

// server.listen(3333);
// //basicamente isso indica em qual porta nossa aplicação vai rodar = > localhost:3333

// import { DatabaseMemory } from "./database-memory.js";

import { fastify } from "fastify";
import { DataBasePostgress } from "./database-postgress.js";
const server = fastify();
//criamos uma váriavel para nossa classe exportada no arquivo data-base
// const database = new DatabaseMemory();
const database = new DataBasePostgress();
//criação de rota

//Métodos HTTP --> Ações em uma API

// GET(busca), POST(criação), PUT(alteração), DELETE(deletar), PATCH(alterar informações específica)

//Quando o usuário for para o endereço '/' ou como no react 'raiz' "," eu vou executar..

//   ROTAS DE EXEMPLO

//localhost:3333
// server.get("/", () => {
//   return "Hello world";
// });

// //localhost:3333/hello
// server.get("/hello", () => {
//   return "Hello Neitã";
// });

// //localhost:3333/node
// server.get("/node", () => {
//   return "Hello Dev";
// });

// Quando eu chamar a porta POST http://localhost:3333/videos eu vou estar criando um novo video

// Vamos utilizar o Request Body para deixar a criação de vídeos modular
// Ou seja, sempre que eu utilizar o POST ou um PUT nos vamos enviar um "corpo" para a requisição
// Corpo pode ser os dados dos vídeos que estão sendo inseridos, as informações

server.post("/videos", async (request, reply) => {
  // Pegar o corpo que está vindo da requisição
  const { title, description, duration } = request.body;
  await database.create({
    // Ao invés de definir o conteúdo manualmente, vamos usar o body da requisição
    // Utilizamos também uma short syntax para definir a informação, antes ficaria "title : title"
    title,
    description,
    duration,
  });
  return reply.status(201).send;
  //Significa que algo foi criado
});

// Quando eu chamar a porta GET http://localhost:3333/videos eu vou estar buscando um video

server.get("/videos", async (request) => {
  // De dentro dos meus requests eu quero buscar meus query parameters
  const search = request.query.search;
  // Vamos conseguir listar todos os vídeos adicionados
  const videos = await database.list(search);
  return videos;
});

// Quando eu chamar a porta PUT http://localhost:3333/videos eu vou estar atualizando um video
// E algo interessante, ao decidirmos que vamos alterar algo (PUT) isso será destinado a apenas 1 objeto e não ao conjunto.
// Vamos precisar direcinar para o ID ou algum identificador do nosso Objeto
// Route  Parameter é um parametro que é enviado na rota, e com o fastify iremos adicionar o /:id
server.put("/videos/:id", async (request, reply) => {
  // Vai buscar o id no parametro da requisição
  const videoID = request.params.id;
  const { title, description, duration } = request.body;

  // Quero fazer uma alteração no vídeo com esse ID
  // Ele vai necessitar das informações do body para realizar as alterações
  await database.update(videoID, {
    title,
    description,
    duration,
  });
  // Código 204 significa que teve sucesso mas não tem conteúdo na resposta
  return reply.status(204).send;
});

// Quando eu chamar a porta DELETE http://localhost:3333/videos eu vou estar deletando um video
// Iremos usar o Route Parameter também
server.delete("/videos/:id", async (request, reply) => {
  const videoID = request.params.id;

  await database.delete(videoID);

  return reply.status(204).send;
});

server.listen({
  host: "0.0.0.0",
  port: process.env.PORT ?? 3333,
});
