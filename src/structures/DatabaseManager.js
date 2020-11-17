const fs = require('fs');

class DatabaseManager {
	constructor(fileName) {

		this.jsonFilePath = `Database/${fileName}.json`;

		this.data = {};

		if (!fs.existsSync(this.jsonFilePath)) {
			if (!fs.existsSync('Database')) fs.mkdirSync('Database');
			fs.writeFileSync(this.jsonFilePath, '{}', 'utf8');
		} else {
			this._fetchDataFromFile();
		}
	}
	_fetchDataFromFile() {
		const savedData = JSON.parse(fs.readFileSync(this.jsonFilePath));
		if (typeof savedData === 'object') {
			this.data = savedData;
		}
	}
	_saveDataToFile() {
		fs.writeFileSync(this.jsonFilePath, JSON.stringify(this.data, null, 2), 'utf8');
	}
	get(key) {
		const args = key.split('.');
		let dataObject = this.data;
		for (const keys of args) {
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) return Promise.resolve(null);
			if (keys == args[args.length - 1]) return Promise.resolve(dataObject[keys]);
			else dataObject = dataObject[keys];
		}
	}

	has(key) {
		const args = key.split('.');
		let dataObject = this.data;
		for (const keys of args) {
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) return false;
			if (keys == args[args.length - 1]) return Boolean(dataObject[keys]);
			else dataObject = dataObject[keys];
		}
	}
	set(key, value) {
		const args = key.split('.');
		let dataObject = this.data;
		for(const keys of args) {
			if(keys == args[args.length - 1]) {
				dataObject[keys] = value;
				break;
			}
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) dataObject = dataObject[keys] = {};
			else dataObject = typeof dataObject[keys] !== 'object' ? dataObject[keys] = {} : dataObject[keys];
		}
		this._saveDataToFile();
		return this.data;
	}
	delete(key) {
		const args = key.split('.');
		let dataObject = this.data;
		for (const keys of args) {
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) return false;
			if (keys == args[args.length - 1]) {
				delete dataObject[keys];
				this._saveDataToFile();
				return true;
			}
			else {dataObject = dataObject[keys];}
		}

	}
	all() {
		return this.data;
	}
	add(key, count) {
		const args = key.split('.');
		let dataObject = this.data;
		for (const keys of args) {
			if(!Object.prototype.hasOwnProperty.call(dataObject, keys)) return null;
			if (keys == args[args.length - 1]) {
				if (isNaN(dataObject[keys])) return null;
				dataObject[keys] = parseInt(dataObject[keys]) + count;
				this._saveDataToFile();
				return dataObject[keys];
			}
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
				if (!Array.isArray(dataObject[keys])) return null;
				dataObject[keys].push(element);
				this._saveDataToFile();
				return dataObject[keys];
			}
			else {dataObject = dataObject[keys];}
		}
	}
}

module.exports = DatabaseManager;