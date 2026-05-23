# Controle de validade

Este projeto tem duas partes:

- `backend/` — API Node.js + MongoDB (Express + Mongoose)
- `frontend/` — site estático em HTML/CSS/JS

## Como funciona

- Local: o frontend usa `http://localhost:3000` quando aberto em `localhost`.
- Remoto: quando aberto em outro host, o frontend usa `https://controle-de-validade-b1kj.onrender.com`.
- O backend usa `process.env.MONGO_URL` quando disponível; caso contrário, ele se conecta ao Mongo local em `mongodb://127.0.0.1:27017/controle`.

## Rodar localmente

### Backend

1. Abra o terminal em `backend`
2. Instale dependências (se ainda não instalou):

```powershell
cd backend
npm install
```

3. Rode o backend:

```powershell
npm start
```

Se você estiver usando Mongo local, basta garantir que o serviço esteja rodando.

### Frontend

- Abra o arquivo `frontend/index.html` no navegador
- Ou use um servidor estático a partir da pasta `frontend` (recomendado)

Exemplo com Python:

```powershell
cd frontend
python -m http.server 5500
```

Acesse `http://127.0.0.1:5500`

## Deploy no Render (backend)

A API backend pode ser publicada no Render como um serviço web.

1. Conecte o repositório ao Render.
2. Use o caminho `backend` como o diretório do serviço.
3. Build command: `npm install`
4. Start command: `npm start`
5. Configure a variável de ambiente do Render:

```text
MONGO_URL=<sua string de conexão MongoDB>
```

O backend ficará disponível em uma URL do Render.

## Deploy no Vercel (frontend)

O frontend é estático e pode ser publicado no Vercel.

1. Conecte o repositório ao Vercel.
2. Defina a pasta de publicação como `frontend`.
3. Não é necessário comando de build para HTML estático.
4. Acesse o site no domínio Vercel.

> Observação: se o backend remoto mudar de URL, atualize o valor de `REMOTE_API` nos arquivos `frontend/cadastrar.html`, `frontend/listar.html` e `frontend/editar.html`.

## Atualizar a URL do backend remoto

Se você tiver uma URL diferente da antiga `https://controle-de-validade-b1kj.onrender.com`, abra os arquivos `frontend/*.html` e troque `REMOTE_API` para a nova URL do backend.

## Erro comum

- Se o backend não conectar ao Mongo, verifique se `MONGO_URL` está configurado no deploy do Render ou se o Mongo local está ativo.

