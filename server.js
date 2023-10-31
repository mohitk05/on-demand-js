import express from "express";
import { createClient } from 'redis';
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json())

const client = await createClient({
    url: process.env.REDIS_URL,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
})
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

await client.set('key', 'value');
const value = await client.get('key');

const FUNCTIONS_KEY = 'FUNCTIONS';

app.post('/create-function/:name', async (req, res) => {
    const functionBody = req.body.function;
    await client.HSET(FUNCTIONS_KEY, req.params.name, functionBody);
    res.send('Ok');
})

app.post('/execute/:name', async (req, res) => {
    const context = req.body.context;
    const functionBody = await client.HGET(FUNCTIONS_KEY, req.params.name);
    try {
        console.log(functionBody, context);
        console.log(`(${functionBody})({ ...context })`)
        const data = eval(`(${functionBody})({ ...context })`)
        res.send({ result: data });
    } catch(e) {
        res.status(500).send('Error: ' + e.toString());
    }
})

app.listen(3000, () => {
    console.log('Listening at 3000');
})

process.on('SIGTERM', async () => {
    await client.disconnect();
})