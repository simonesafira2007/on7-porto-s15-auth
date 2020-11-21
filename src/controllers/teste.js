const deleteTarefa = (req, res) => {
    const id = req.params.id;
  
    const authHeader = req.get('authorization');
  
    if (!authHeader) {
      return res.status(401).send('Header não encontrado');
    };
    
    const token = authHeader.split(' ')[1];
  
    jwt.verify(token, SECRET, err => {
      if (err) {
        return res.status(403).send('Token inválido');
      };
  
      tarefas.find({ id }, (err, tarefa) => {
        if (tarefa.length > 0) {
          tarefas.deleteOne({ id }, err => {
            if (err) {
              return res.status(424).send({ message: err.message });
            };
            return res.status(200).send('Tarefa deletada com sucesso');
          });
        } else {
          return res.status(404).send('Tarefa não encontrada');
        };
      });
    });
  };