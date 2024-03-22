import { randomUUID } from "node:crypto";

export class DatabaseMemory {
  #videos = new Map();

  // Vai retornar todos os vídeos mas sem os IDS
  // O Array.from transforma conteúdos que não são Arrays em Arrays (resolver bug de requisição)
  // list() {
  //   return Array.from(this.#videos.values());
  // }

  // Vai retornar todos os vídeos com ID
  list(search) {
    return Array.from(this.#videos.entries())
      .map((videoArray) => {
        const id = videoArray[0];
        const data = videoArray[1];

        return {
          id,
          ...data,
        };
      })
      .filter((video) => {
        if (search) {
          return video.title.includes(search);
        }
        return true;
      });
  }

  // Aqui, ao invés de utilizarmos um GET para colocarmos os vídeos dentro do nosso map, iremos usar algo próprio dele, o SET
  // E devemos criar um ID para cada vídeo antes de setalo no map (requerido pelo MAP), então vamos usar a biblioteca de crypto do node
  // Quando eu criar um vídeo no banco de dados de memoria, vamos gerar um ID aleatório (randomUUID)
  // randomUUID - Universal Unique ID Aleatória

  // Seriam interassantes validações Validações

  create(video) {
    const videoID = randomUUID();
    this.#videos.set(videoID, video);
  }
  // os PUT já tem id, se lembra do Router Parameter lá na fase de rotas?
  // Então não precisa criar um ramdomUUID para colocar no requerimento do Map (key, obj)
  update(id, video) {
    this.#videos.set(id, video);
  }
  //Para deletar não precisamos das informações do vídeo, apenas do ID
  delete(id) {
    this.#videos.delete(id);
  }
}
