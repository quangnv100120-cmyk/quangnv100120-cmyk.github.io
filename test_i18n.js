const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const viJson = fs.readFileSync('locales/vi.json', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously" });
dom.window.fetch = async (url) => {
    return {
        ok: true,
        json: async () => JSON.parse(viJson)
    };
};

const i18nCode = fs.readFileSync('i18n.js', 'utf8');
const script1 = dom.window.document.createElement("script");
script1.textContent = i18nCode;
dom.window.document.head.appendChild(script1);

const headerCode = fs.readFileSync('header.js', 'utf8');
const script2 = dom.window.document.createElement("script");
script2.textContent = headerCode;
dom.window.document.body.appendChild(script2);

setTimeout(() => {
    const items = dom.window.document.querySelectorAll('a.nav-item');
    items.forEach(el => console.log(el.outerHTML));
}, 100);
