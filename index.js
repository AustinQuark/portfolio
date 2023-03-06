import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import captureWebsite from 'capture-website';
import cron from 'node-cron';


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();
const router = express.Router();
const PORT = 80;

app.set('views', path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname, '/public')));

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'views', 'portfolio.html'));
})

app.use('/', router);
app.listen(PORT, () => {
    console.log('Server Listened');
})

cron.schedule('0 0 * * *', () => {
    captureWebsite.file('', 'screenshot', {
    });
});

const options = {
    launchOptions: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    },
    delay: 5,
    width: 854,
    height: 480,
    type: 'webp',
    darkMode: true,
    overwrite: true
};

const items = [
	['https://projectbar-events.com/index', 'public/images/screenshot0'],
	['https://github.com/AustinQuark/philosophers', 'public/images/screenshot1'],
    ['https://github.com/AustinQuark/push_swap', 'public/images/screenshot2'],
    ['https://github.com/AustinQuark/VanillaStopWatch', 'public/images/screenshot3'],
    ['https://github.com/AustinQuark/cub3D', 'public/images/screenshot4'],
    ['https://github.com/AustinQuark/minishell_42', 'public/images/screenshot5']
];

await Promise.all(items.map(([url, filename]) => {
	return captureWebsite.file(url, `${filename}.png`, options);
}));
