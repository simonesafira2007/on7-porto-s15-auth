//apontamento do model que criamos para as Tarefas
const tarefas = require("../models/tarefas");
const SECRET = process.env.SECRET;
const jwt = require("jsonwebtoken");

const getAll = (req, res) => {
  const authHeader = req.get("authorization");
  console.log(authHeader);

  if (!authHeader) {
    return res
      .status(401)
      .send("Você precisa preencher o header Authorization!");
  }

  const token = authHeader.split(" ")[1];
  console.log(token);

  jwt.verify(token, SECRET, function (erro) {
    if (erro) {
      return res.status(403).send("Esse token não é válido!");
    }

    tarefas.find(function (err, tarefas) {
      if (err) {
        return res.status(500).send({ message: err.message });
      } else {
        return res.status(200).send(tarefas);
      }
    });
  });
};

const getById = (req, res) => {
  const id = req.params.id;
  const authHeader = req.get("authorization");

  if (!authHeader) {
    return res.status(401).send("Header não encontrado");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err) => {
    if (err) {
      return res.status(403).send("Token não é válido");
    }

    tarefas.find({ id }, (err, tarefas) => {
      if (err) {
        return res.status(424).send({ message: err.message });
      } else {
        return res.status(200).send(tarefas);
      }
    });
  });
};

//Endpoint: localhost:8080/tarefas
const postTarefa = (req, res) => {
  const authHeader = req.get("authorization");

  if (!authHeader) {
    return res.status(401).send("Header não encontrado");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err) => {
    if (err) {
      return res.status(403).send("Token não é válido");
    }

    let tarefa = new tarefas(req.body);

    tarefa.save(function (err) {
      if (err) {
        res.status(500).send({ message: err.message });
      }
      res.status(201).send(tarefa.toJSON());
    });
  });
};
  
const deleteTarefa = (req, res) => {
  const id = req.params.id;

  const authHeader = req.get("authorization");

  if (!authHeader) {
    return res.status(401).send("Header não encontrado");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err) => {
    if (err) {
      return res.status(403).send("Este token não é válido");
    }

    tarefas.find({ id }, (err, tarefa) => {
      if (tarefa.length > 0) {
        tarefas.deleteOne({ id }, (err) => {
          if (err) {
            return res.status(424).send({ message: err.message });
          }
          return res.status(200).send("Tarefa deletada com sucesso");
        });
      } else {
        return res.status(404).send("Tarefa não encontrada");
      }
    });
  });
};

const deleteTarefaConcluida = (req, res) => {
  const authHeader = req.get("authorization");

  if (!authHeader) {
    return res.status(401).send("Header não encontrado");
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET, (err) => {
    if (err) {
      return res.status(403).send("Este token não é válido");
    }

    tarefas.find({ concluido: true }, (err, tarefa) => {
      if (tarefa.length > 0) {
        tarefas.deleteMany({ concluido: true }, (err) => {
          if (err) {
            return res.status(424).send({ message: err.message });
          }
          return res.status(200).send("Tarefa deletada: sucesso");
        });
      }
    });
  });
};

const putTarefa = (req, res) => {
  const id = req.params.id;

  tarefas.find({ id }, function (err, tarefa) {
    if (tarefa.length > 0) {
      //UpdateMany atualiza vários registros de uma unica vez
      //UpdateOne atualiza um único registro por vez

      tarefas.updateMany({ id }, { $set: req.body }, function (err) {
        if (err) {
          res.status(500).send({ message: err.message });
        }
        res.status(200).send({ message: "Registro alterado com sucesso" });
      });
    } else {
      res
        .status(200)
        .send({
          message: "Não há registros para serem atualizados com esse id",
        });
    }
  });
};

module.exports = {
  getAll,
  getById,
  postTarefa,
  deleteTarefa,
  deleteTarefaConcluida,
  putTarefa,
};
