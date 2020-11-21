//apontamento do model que criamos para as Colaboradoras
const colaboradoras = require("../models/colaboradoras");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

//Endpoint: localhost:8080/colaboradoras
const create = (req, res) => {
  const senhaComHash = bcrypt.hashSync(req.body.senha, 10);
  req.body.senha = senhaComHash;
  console.log("senha com hash : ", senhaComHash);

  const colaboradora = new colaboradoras(req.body);

  colaboradora.save(function (err) {
    if (err) {
      res.status(500).send({ message: err.message });
    }
    res.status(201).send(colaboradora.toJSON());
  });
};
  
//Endpoin: localhost:8080/colaboradoras

const getAllColab = (req, res) => {
  colaboradoras.find(function (err, colaboradoras) {
    if (err) {
      res.status(500).send({ message: err.message });
    }
    res.status(200).send(colaboradoras);
  });
};

//localhost:8080/colaboradoras/login

const login = (req, res) => {
  colaboradoras.findOne(
    { email: req.body.email },
    function (error, colaboradora) {
      if (!colaboradora) {
        return res
          .status(404)
          .send(`Não existe colaboradora com o email ${req.body.email}`);
      }

      const senhaValida = bcrypt.compareSync(
        req.body.senha,
        colaboradora.senha
      );

      if (!senhaValida) {
        return res.status(403).send("que senha é essa hein");
      }

      const token = jwt.sign({ email: req.body.email }, SECRET);

      return res.status(200).send(token);
    }
  );
};

module.exports = {
  create,
  getAllColab,
  login,
};
