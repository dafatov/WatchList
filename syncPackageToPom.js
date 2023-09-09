const fs = require('fs');

const version = JSON.parse(fs.readFileSync('package.json', 'utf-8')).version;
console.log('found version ' + version + ' in package.json');
const pomContent = fs.readFileSync('pom.xml', 'utf-8');

const newPom = pomContent.replace(/<revision>.*<\/revision>/, `<revision>${version}</revision>`);
fs.writeFileSync('pom.xml', newPom);
console.log('pom.xml updated to version ' + version);
