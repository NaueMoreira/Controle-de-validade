const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/controle';

mongoose.connect(MONGO_URL)
  .then(() => console.log(`Mongo conectado em ${MONGO_URL}`))
  .catch(err => console.log("Erro Mongo:", err));

const Produto = mongoose.model('Produto', {
  codigoInterno: String,
  codigoBarras: String,
  nome: String,
  validade: String,
  quantidade: Number,
  sessao: String,
  tipo: String,
  alertaDias: Number
});

const ProdutoMestre = mongoose.model(
  'ProdutoMestre',
  {
    codigoInterno: String,
    codigoBarras: String,
    nome: String,
    tipo: String,
    sessao: String,
    fabricante: String,
    laboratorio: String,
    alertaDias: Number
  },
  "Produtosmestres"
);

const ProdutoVencimento = mongoose.model(
  "ProdutoVencimento",
  {
    produtoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProdutoMestre"
    },
    validade: String,
    quantidade: Number,
    sessao: String
  },
  "produtos"
);

//rotas

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.post('/produtos', async (req, res) => {
  const produto = new Produto(req.body);
  await produto.save();

  await ProdutoMestre.findOneAndUpdate(
{
  $or: [
    { codigoInterno: produto.codigoInterno },
    { codigoBarras: produto.codigoBarras }
  ]
},
{
  codigoInterno: produto.codigoInterno,
  codigoBarras: produto.codigoBarras,
  nome: produto.nome,
  tipo: produto.tipo,
  sessao: produto.sessao,
  alertaDias: produto.alertaDias
},
{ upsert: true, new: true }
);

res.json({
  id: produto._id,
  codigoInterno: produto.codigoInterno,
  codigoBarras: produto.codigoBarras,
  nome: produto.nome,
  tipo: produto.tipo,
  sessao: produto.sessao,
  alertaDias: produto.alertaDias
});

});

app.get('/produtos', async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
});

app.get('/produtos/alerta', async (req, res) => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const limite = new Date(hoje);
  limite.setDate(limite.getDate() + 60);

  const hojeStr = hoje.toISOString().slice(0, 10);
  const limiteStr = limite.toISOString().slice(0, 10);

  const produtos = await Produto.find({
    validade: { $gte: hojeStr, $lte: limiteStr }
  }).sort({ validade: 1 });

  res.json(produtos);
});

app.get('/produtos/buscar/:codigo', async (req, res) => {
  const codigo = req.params.codigo;
  let produto = await ProdutoMestre.findOne({
    $or: [
      { codigoInterno: codigo },
      { codigoBarras: codigo }
    ]
  });

  if (!produto) {
    produto = await Produto.findOne({
      $or: [
        { codigoInterno: codigo },
        { codigoBarras: codigo }
      ]
    });
  }

  if (!produto) {
    return res.status(404).json({
      mensagem: "Produto não encontrado"
    });
  }

  res.json(produto);
});

app.post('/produtos-mestre', async (req, res) => {
  try {

    const produto = new ProdutoMestre(req.body);

    await produto.save();

    res.json(produto);

  } catch (erro) {

    res.status(500).json({
      erro: erro.message
    });

  }
});

app.get('/produtos/:id', async (req, res) => {
  const produto = await Produto.findById(req.params.id);
  res.json(produto);
});

app.put('/produtos/:id', async (req, res) => {
  const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(produto);
});

app.delete('/produtos/:id', async (req, res) => {
  await Produto.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando");
});