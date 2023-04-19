import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'express-force-https';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
const router = express.Router();
const PORT = 80;

app.set('views', path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(https);


router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'portfolio.html'));
})

app.use('/', router);
app.listen(PORT, () => {
    console.log('Server Listened');
});