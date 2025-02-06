import express from 'express';
import path from 'path';
import loginRouter from './routes/loginRouters';
// import cors from 'cors';
const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));


app.use(express.static(path.join(__dirname, "public")));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loginRouter)
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});