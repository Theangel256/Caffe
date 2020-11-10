/* eslint-disable no-inline-comments */
console.log('DatabaseManager');
console.time('DatabaseManager');
const database = require('./DatabaseManager');
const db = new database('Users');

console.log('\t\t\tDANNY');
db.set('Danny', { language: ['C#', 'GO', 'PY', 'JS', 'TS', 'SQL'], age: 16 });

console.log(db.get('Danny'));
// Danny: { language: ["C#", "GO", "PY", "JS", "TS", "SQL"], age: 16 }
console.log('\n');

db.push('Danny.language', 'Test');
db.add('Danny.age', 1);

console.log(db.get('Danny'));
// Danny: { language: ["C#", "GO", "PY", "JS", "TS", "SQL","Test"], age: 17 }

db.subtract('Danny.age', 1);
console.log(db.get('Danny'));
// Danny: { language: ["C#", "GO", "PY", "JS", "TS", "SQL","Test"], age: 16 }

console.log('\n');
console.log('\t\t\tATZU ');
db.set('Atzu', { language: ['C#', 'PY', 'JS', 'TS', 'SQL'], age: 10 });

console.log(db.get('Atzu'));
// Atzu: { language: ["C#", "PY", "JS", "TS", "SQL"], age: 10 }
console.log('\n');

db.push('Atzu.language', 'Hola');
db.add('Atzu.age', 7);

console.log(db.get('Atzu'));
// Atzu: { language: ["C#", "PY", "JS", "TS", "SQL","Hola"], age: 17 }
console.log('\n');

console.log('\t\t\tIDK');
db.set('idk', { language: ['C#', 'GO', 'PY', 'JS', 'TS', 'SQL'], age: 16 });

console.log(db.get('idk'));
// idk: { language: ["C#", "GO", "PY", "JS", "TS", "SQL"], age: 16 }
console.log('\n');

db.push('idk.language', 'Test');
db.add('idk.age', 1);

console.log(db.get('idk'));
// idk: { language: ["C#", "GO", "PY", "JS", "TS", "SQL","Test"], age: 17 }
console.log('\n');


db.delete('Danny');
db.delete('Atzu');

console.log(db.has('Danny')); // false

console.log(db.has('Atzu')); // false

console.log(db.has('idk')); // true

console.log(db.all());
/*
{
  "idk": {
    "language": ["C#","GO","PY","JS","TS","SQL","Test"],
    "age": 17
  }
}
*/

console.timeEnd('DatabaseManager');
// 230 - 320 ms


console.log('\n\nMegadb');
console.time('Megadb');
const mega = require('megadb');
const megadb = new mega.crearDB('Users');

console.log('\t\t\tDANNY');
megadb.set('Danny', { language: ['C#', 'GO', 'PY', 'JS', 'TS', 'SQL'], age: 16 });

console.log(megadb.get('Danny'));
// Danny: Promise { { language: ["C#", "GO", "PY", "JS", "TS", "SQL"], age: 16 } }
console.log('\n');

megadb.push('Danny.language', 'Test');
megadb.add('Danny.age', 1);

console.log(megadb.get('Danny'));
// Danny: Promise { { language: ["C#", "GO", "PY", "JS", "TS", "SQL","Test"], age: 17 } }

megadb.subtract('Danny.age', 1);
console.log(megadb.get('Danny'));
// Danny: Promise { { language: ["C#", "GO", "PY", "JS", "TS", "SQL","Test"], age: 16 } }

console.log('\n');
console.log('\t\t\tATZU ');
megadb.set('Atzu', { language: ['C#', 'PY', 'JS', 'TS', 'SQL'], age: 10 });

console.log(megadb.get('Atzu'));
// Atzu: Promise { { language: ["C#", "PY", "JS", "TS", "SQL"], age: 10 } }
console.log('\n');

megadb.push('Atzu.language', 'Hola');
megadb.add('Atzu.age', 7);

console.log(megadb.get('Atzu'));
// Atzu: Promise { { language: ["C#", "PY", "JS", "TS", "SQL","Hola"], age: 17 } }

console.log('\n');

console.log('\t\t\tIDK');
megadb.set('idk', { language: ['C#', 'GO', 'PY', 'JS', 'TS', 'SQL'], age: 16 });

console.log(megadb.get('idk'));
// Promise { idk: { language: ["C#", "GO", "PY", "JS", "TS", "SQL"], age: 16 } }
console.log('\n');

megadb.push('idk.language', 'Test');
megadb.add('idk.age', 1);

console.log(megadb.get('idk'));
// Promise { idk: { language: ["C#", "GO", "PY", "JS", "TS", "SQL","Test"], age: 17 } }
console.log('\n');


megadb.delete('Danny');
megadb.delete('Atzu');

console.log(megadb.has('Danny')); // false

console.log(megadb.has('Atzu')); // false

console.log(megadb.has('idk')); // true

console.log(megadb.datos());
/*
Promise {
  {
	"idk": {
    "language": [Array],
    "age": 17
  	}
  }
}
*/
console.timeEnd('Megadb');
// 400 - 530 ms