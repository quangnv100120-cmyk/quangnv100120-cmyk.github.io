const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync('/Users/quangnguyen/Desktop/Localization.json', 'utf8');
const data = JSON.parse(raw);

const vi = {};
const en = {};

data.variables.forEach(v => {
    const name = v.name;
    const parts = name.split('/');
    
    function setVal(obj, parts, value) {
        let current = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {};
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
    }

    const vieVal = v.valuesByMode['628:0'] || '';
    const engVal = v.valuesByMode['2616:2'] || '';

    setVal(vi, parts, vieVal);
    setVal(en, parts, engVal);
});

fs.writeFileSync(path.join(__dirname, 'locales', 'vi.json'), JSON.stringify(vi, null, 2));
fs.writeFileSync(path.join(__dirname, 'locales', 'en.json'), JSON.stringify(en, null, 2));

console.log("Translation files updated successfully.");
