import captureWebsite from 'capture-website';

const optionsWebp = {
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
    overwrite: true,
};

const optionsPng = {
    launchOptions: {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    },
    delay: 5,
    width: 854,
    height: 480,
    darkMode: true,
    overwrite: true,
};


const items = [
	['https://github.com/AustinQuark/cub3D', 'public/images/screenshot0'],
	['https://austinquark.com/', 'public/images/screenshot1'],
    ['https://github.com/AustinQuark/push_swap', 'public/images/screenshot2'],
    ['https://github.com/AustinQuark/philosophers', 'public/images/screenshot3'],
    ['https://projectbar-events.com', 'public/images/screenshot4'],
    ['https://github.com/AustinQuark/minishell_42', 'public/images/screenshot5']
];

console.log('Do not forget to update links in cubeThree.js !');

await Promise.all(items.map(([url, filename]) => {
	return captureWebsite.file(url, `${filename}.webp`, optionsWebp);
}));

await Promise.all(items.map(([url, filename]) => {
    return captureWebsite.file(url, `${filename}.png`, optionsPng);
}));


