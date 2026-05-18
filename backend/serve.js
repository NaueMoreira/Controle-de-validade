const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://nauemoreira_db_user:0h2fJJDMJvtzDtaH@cluster1.sv7ppla.mongodb.net/?appName=Cluster1');

const Produto = mongoose.model('Produto', {
  codigo: String,
  nome: String,
  validade: String,
  quantidade: Number,
  sessao: String
});

//rotas


app.get("/", (req, res) => {
    res.send("API funcionando 🚀");
});

app.post('/produtos', async (req, res) => {
  const produto = new Produto(req.body);
  await produto.save();
  res.json(produto);
});

app.get('/produtos', async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
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

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));