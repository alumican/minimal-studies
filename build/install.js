'use strict';

const fs = require('fs');
const configJson = require('./config.json');
const packageJson = require('./package.json');

function getOption(option, key, defaultValue) {
	return typeof option[key] !== 'undefined' ? option[key] : defaultValue;
}

function saveJson(data, filePath) {
	fs.writeFileSync(filePath, JSON.stringify(data, null, '  '));
}

// copy types to package.json
const devDependencies = packageJson.devDependencies || {};

for (let name in devDependencies) {
	if (name.indexOf('@types/') == 0) {
		delete devDependencies[name];
	}
}

devDependencies['@types/node'] = '*';
devDependencies['@types/gulp'] = '*';
if (configJson.typeScript) {
	const types = configJson.typeScript.types;
	for (let i in types) {
		devDependencies['@types/' + types[i]] = '*';
	}
}
packageJson.devDependencies = devDependencies;
saveJson(packageJson, './package.json');

// create tsconfig.json
const compilerOptions = configJson.typeScript || {};
delete compilerOptions.include;
delete compilerOptions.minify;
compilerOptions.typeRoots = [ 'build/node_modules/@types/' ];
saveJson({ compilerOptions: compilerOptions }, '../tsconfig.json');