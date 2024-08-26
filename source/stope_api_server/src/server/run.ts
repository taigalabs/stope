import express from 'express';

const PORT = 3000;

export async function runServer() {
  const app = express();

  app.get('/', (_req, res) => {
    res.send('running');
  })

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}
