import express from 'express';
import dbConnect from "./config/db.js"

const app = express();
const result=dbConnect();

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello Avijit ${name}!`);
});

const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});