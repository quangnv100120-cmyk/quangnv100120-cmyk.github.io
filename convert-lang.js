const fs = require('fs');
const vi = JSON.parse(fs.readFileSync('./locales/vi.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('./locales/en.json', 'utf8'));

const output = `// Auto-generated language payload for offline file:// compatibility
window.IMPC_LOCALES = {
    vi: ${JSON.stringify(vi, null, 4)},
    en: ${JSON.stringify(en, null, 4)}
};
`;

fs.writeFileSync('./locales/lang-data.js', output);
console.log('Successfully generated lang-data.js');
