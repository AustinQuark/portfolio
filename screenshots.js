import captureWebsite from 'capture-website';

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
	['https://projectbar-events.com', 'public/images/screenshot0'],
	['https://github.com/AustinQuark/philosophers', 'public/images/screenshot1'],
    ['https://github.com/AustinQuark/push_swap', 'public/images/screenshot2'],
    ['https://github.com/AustinQuark/VanillaStopWatch', 'public/images/screenshot3'],
    ['https://github.com/AustinQuark/cub3D', 'public/images/screenshot4'],
    ['https://github.com/AustinQuark/minishell_42', 'public/images/screenshot5']
];

console.log('Do not forget to update links in cubeThree.js !');

await Promise.all(items.map(([url, filename]) => {
	return captureWebsite.file(url, `${filename}.png`, options);
}));

