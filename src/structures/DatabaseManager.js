// Requiere el modulo file-system
const fs = require('fs');
// la clase para crear bases de datos ej: `new database`
class DatabaseManager {
	//hace un constructor con la base de datos a crear ej: `new database("users")`
	constructor(fileName) {
		// Define el path donde los archivos se usarán
		this.jsonFilePath = "Database/" + fileName + ".json";
		// Crea los datos para cada json
		this.data = {};
		// Si no existe el archivo y si no existe el directorio "Database" lo creará y escribirá un documento ("{}")
		if (!fs.existsSync(this.jsonFilePath)) {
			if (!fs.existsSync('Database')) fs.mkdirSync('Database');
			fs.writeFileSync(this.jsonFilePath, '{}', 'utf8');
		// Si existe ejecutará la function privada
		} else {
			this._fetchDataFromFile();
		}
	}
	_fetchDataFromFile() {
		// Lee los archivos que creaste
		const savedData = JSON.parse(fs.readFileSync(this.jsonFilePath));
		// Si el archivo es un objeto ({}) guardará el objeto en la variable data
		if (typeof savedData === 'object') {
			this.data = savedData;
		}
	}
	_saveDataToFile() {
		// Escribe en los archivos el dato que guardó
		fs.writeFileSync(this.jsonFilePath, JSON.stringify(this.data, null, 2), 'utf8');
	}
	get(key) {
		// consigue valores con el clave-split "." ejemplo: `message.guild.id.prefix`
		const args = key.split('.');
		// define los datos guardados antes en una variable
		let dataObject = this.data;
		// busca en el path dado si hay clave-split
		for (const keys of args) {
			// Si no encuentra lo buscado retornará inexistente
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) return Promise.resolve(null);
			// Si la palabra despues de el "." existe como propiedad retornará el valor
			if (keys == args[args.length - 1]) return Promise.resolve(dataObject[keys]);
			// Si no lo encuentra  devolvera los datos despues de el clave-split
			else dataObject = dataObject[keys];
		}
	}
	has(key) {
		// Ya explicado arriba
		const args = key.split('.');
		let dataObject = this.data;
		for (const keys of args) {
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) return false;
			// en vez de retornar el valor dirá si existe o no
			if (keys == args[args.length - 1]) return Boolean(dataObject[keys]);
			else dataObject = dataObject[keys];
		}
	}
	set(key, value) {
		const args = key.split('.');
		let dataObject = this.data;
		for(const keys of args) {
			if(keys == args[args.length - 1]) {
				// definirá la propiedad dada y el valor dado
				dataObject[keys] = value;
				// rompe el for
				break;
			}
			// Si no encuentra los datos ni la propiedad antes de 1 clave-split establecerá nuevos datos ("{}")
			//               Si             No         No
			// Ej: `message.guild.id.aidjaijesfke.prefix`
			// Si hay datos adentro serán borrados
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) dataObject = dataObject[keys] = {};
			// Si los datos en el json es un objeto, definirá el clave-split como objeto y si no retornara el dato
			else dataObject = typeof dataObject[keys] !== 'object' ? dataObject[keys] = {} : dataObject[keys];
		}
		// ejecuta la función privada para guardar los datos en archivos
		this._saveDataToFile();
		// retorna el valor establecido
		return this.data;
	}
	delete(key) {
		const args = key.split('.');
		let dataObject = this.data;
		for (const keys of args) {
			// si no encuentra lo buscado retornará falso (no lo borró)
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) return false;
			//si encuentra la propiedad despues el clave-split borrará el valor, guardará los datos cambiados
			// y retornará true (borrado)
			if (keys == args[args.length - 1]) {
				delete dataObject[keys];
				this._saveDataToFile();
				return true;
			}
			// si no devolvera los datos después del clave-split
			else {dataObject = dataObject[keys];}
		}
	}
	all() {
		// retorna toda la base de datos solicitada
		return this.data;
	}
	add(key, count) {
		const args = key.split('.');
		let dataObject = this.data;
		for (const keys of args) {
			// Si no encuentra lo buscado retornará inexistente
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) return null;
			if (keys == args[args.length - 1]) {
				// Si lo encontrado "isNotaNumber" retornará null
				if (isNaN(dataObject[keys])) return null;
				// convertirá el numero sin decimales y sumará lo que le des
				dataObject[keys] = parseInt(dataObject[keys]) + count;
				// guarda los datos cambiados
				this._saveDataToFile();
				// retornará el numero cambiado
				return dataObject[keys];
			}
			// si no encuentra el clave-split require la propiedad despues del "."
			else {dataObject = dataObject[keys];}
		}
	}
	subtract(key, count) {
		const args = key.split('.');
		let dataObject = this.data;
		for (const keys of args) {
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) return null;
			if (keys == args[args.length - 1]) {
				if (isNaN(dataObject[keys])) return null;
				// en vez de sumar, restará lo que le des
				dataObject[keys] = parseInt(dataObject[keys]) - count;
				this._saveDataToFile();
				return dataObject[keys];
			}
			else {dataObject = dataObject[keys];}
		}
	}

	push(key, element) {
		const args = key.split('.');
		let dataObject = this.data;
		for (const keys of args) {
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) return null;
			if (keys == args[args.length - 1]) {
				//si la key de los datos no es array retornará null
				if (!Array.isArray(dataObject[keys])) return null;
				// añadira un nuevo elemento al array
				dataObject[keys].push(element);
				this._saveDataToFile();
				return dataObject[keys];
			}
			else {dataObject = dataObject[keys];}
		}
	}
}

module.exports = DatabaseManager;