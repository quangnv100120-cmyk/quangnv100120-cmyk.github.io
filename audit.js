const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

function audit(node) {
    if (node.nodeType === 3) { // Text node
        const text = node.textContent.trim();
        if (text.length > 0 && 
            node.parentElement.tagName !== 'SCRIPT' && 
            node.parentElement.tagName !== 'STYLE' && 
            node.parentElement.tagName !== 'TITLE') {
            if (!node.parentElement.hasAttribute('data-i18n')) {
                console.log(`UNMAPPED: ${node.parentElement.tagName} -> "${text.substring(0, 50)}"`);
            }
        }
    }
    for (let child of node.childNodes) {
        audit(child);
    }
}

audit(document.body);
