'use strict';

import {Gulp} from "gulp";

type GulpModule = any;
type GetCommandsFunction = (srcFileName:string, dstFileName:string) => any[];

type Mapping = { src:string, dst:string };
type Project = { name:string, js:Mapping[], css:Mapping[], html:Mapping[] };
type ProjectDefault = { js?:Mapping[], css?:Mapping[], html?:Mapping[] };
type Projects = Project[];
type Path = { src:string, dst:string };
type Config = { projects:Projects, default:ProjectDefault, path:Path, typeScript?:any, sass?:any, server?:any };





//----------------------------------------
// load modules

// common
const gulp:Gulp = require('gulp');
const plumber:GulpModule = require('gulp-plumber');
const sourcemaps:GulpModule = require('gulp-sourcemaps');

// TypeScript
const typescript:GulpModule = require('gulp-typescript');
const uglify:GulpModule = require('gulp-uglify');

// Sass
const sass:GulpModule = require('gulp-sass');

// HTML
const removeEmptyLines:GulpModule = require('gulp-remove-empty-lines');
const stripComments:GulpModule = require('gulp-strip-comments');

// Server
const connect:GulpModule = require('gulp-connect');





//----------------------------------------
// load settings

const config:Config = require('./config.json');
const projects:Projects = config.projects;
const projectDefault:ProjectDefault = config.default || {};
const path:Path = config.path;

function getOption(option:any, key:string, defaultValue:any):any {
	return typeof option[key] !== 'undefined' ? option[key] : defaultValue;
}

// check TypeScript option
const typeScriptOption:any = config.typeScript || {};
typeScriptOption.typeRoots = getOption(typeScriptOption, 'typeRoots', ['node_modules/@types/']);
typeScriptOption.removeComments = getOption(typeScriptOption, 'removeComments', true);

const typeScriptOptionDeclaration:boolean = getOption(typeScriptOption, 'declaration', false);
delete typeScriptOption.declaration;

const typeScriptOptionMinify:boolean = getOption(typeScriptOption, 'minify', false);
delete typeScriptOption.minify;

const typeScriptOptionSourceMap:boolean = getOption(typeScriptOption, 'sourceMap', false);
delete typeScriptOption.sourceMap;

// check Sass option
const sassOption:any = config.sass || {};

const sassOptionSourceMap:boolean = getOption(sassOption, 'sourceMap', false);
delete sassOption.sourceMap;





//----------------------------------------
// define functions

const defaultTaskNames:string[] = [];
const watchTaskNames:string[] = [];

const indent:string = '           ';
const color:any = {
	default: '\u001b[39m',

	black  : '\u001b[30m',
	red    : '\u001b[31m',
	green  : '\u001b[32m',
	yellow : '\u001b[33m',
	blue   : '\u001b[34m',
	magenta: '\u001b[35m',
	cyan   : '\u001b[36m',
	white  : '\u001b[37m',

	lightGray   : '\u001b[90m',
	lightRed    : '\u001b[91m',
	lightGreen  : '\u001b[92m',
	lightYellow : '\u001b[93m',
	lightBlue   : '\u001b[94m',
	lightMagenta: '\u001b[95m',
	lightCyan   : '\u001b[96m',

	reset : '\u001b[0m'
};

function createPath(...names:string[]):string {
	return names.filter(function(value:string):boolean {
		return value != '';
	}).join('/');
}

function getTypescriptOptions(outputFileName:string, minify:boolean):any {
	if (minify) {
		typeScriptOption.outFile = outputFileName.replace(/js$/, 'min.js');
		typeScriptOption.declaration = false;
	} else {
		typeScriptOption.outFile = outputFileName;
		typeScriptOption.declaration = typeScriptOptionDeclaration;
	}
	return typeScriptOption;
}

function registerTask(taskName:string, projectName:string, map:Mapping, getExecutionCommands:GetCommandsFunction) {
	const srcPath:string = createPath('..', path.src, projectName, map.src);
	const dstPath:string = createPath('..', path.dst, projectName, map.dst);

	const srcFileName:string = srcPath.split('/').pop();

	const dstPaths:string[] = dstPath.split('/');
	const dstFileName:string = dstPaths.pop();
	const dstDirectory:string = dstPaths.join('/');

	gulp.task(taskName, function() {
		let pipeline:any = gulp
			.src(srcPath, { allowEmpty: true })
			.pipe(plumber());

		console.log(indent + 'Compiling \'' + color.blue + srcPath + color.reset + '\'' + color.lightGray + ' -> ' + color.reset + '\'' + color.blue + dstPath + color.reset + '\'');

		// execution
		const commands:any[] = getExecutionCommands(srcFileName, dstFileName);
		for (let i:number = 0; i < commands.length; ++i) {
			pipeline = pipeline.pipe(commands[i]);
		}

		// output
		pipeline = pipeline.pipe(gulp.dest(dstDirectory));

		// livereload
		if (config.server && config.server.livereload) {
			pipeline = pipeline.pipe(connect.reload());
		}

		return pipeline;
	});

	defaultTaskNames.push(taskName);
}

function registerTypeScript(projectName:string, map:Mapping, index:number, minify:boolean):string {
	const taskName:string = projectName + '-typescript-' + index + (minify ? '-min' : '');
	registerTask(taskName, projectName, map, function(srcFileName:string, dstFileName:string):any[] {
		const commands:any[] = [];
		if (typeScriptOptionSourceMap) {
			commands.push(sourcemaps.init('./'));
		}
		commands.push(typescript(getTypescriptOptions(dstFileName, minify)));
		if (minify) {
			commands.push(uglify());
		}
		if (typeScriptOptionSourceMap) {
			commands.push(sourcemaps.write('./'));
		}
		return commands;
	});
	return taskName;
}

function registerSass(projectName:string, map:Mapping, index:number):string {
	const taskName:string = projectName + '-sass-' + index;
	registerTask(taskName, projectName, map, function(srcFileName:string, dstFileName:string):any[] {
		const commands:any[] = [];
		if (sassOptionSourceMap) {
			commands.push(sourcemaps.init('./'));
		}
		commands.push(sass(sassOption).on('error', sass.logError));
		if (sassOptionSourceMap) {
			commands.push(sourcemaps.write('./'));
		}
		return commands;
	});
	return taskName;
}

function registerHtml(projectName:string, map:Mapping, index:number):string {
	const taskName:string = projectName + '-html-' + index;
	registerTask(taskName, projectName, map, function(srcFileName:string, dstFileName:string):any[] {
		return [
			removeEmptyLines({ removeComments: false, removeSpaces: false }),
			stripComments({ safe: true })
		];
	});
	return taskName;
}

function registerProject(project:Project):void {
	const projectName:string = project.name;
	console.log(indent + '    + \'' + color.blue + projectName + color.reset + '\'');

	const typeScriptTaskNames:string[] = [];
	{
		const maps:Mapping[] = project.js || projectDefault.js;
		if (maps) {
			let taskName:string;
			for (let i:number = 0; i < maps.length; ++i) {
				taskName = registerTypeScript(projectName, maps[i], i, false);
				typeScriptTaskNames.push(taskName);

				if (typeScriptOptionMinify) {
					taskName = registerTypeScript(projectName, maps[i], i, true);
					typeScriptTaskNames.push(taskName);
				}
			}
		}
	}

	const sassTaskNames:string[] = [];
	{
		const maps:Mapping[] = project.css || projectDefault.css;
		if (maps) {
			for (let i:number = 0; i < maps.length; ++i) {
				const taskName:string = registerSass(projectName, maps[i], i);
				sassTaskNames.push(taskName);
			}
		}
	}

	const htmlTaskNames:string[] = [];
	{
		const maps:Mapping[] = project.html || projectDefault.html;
		if (maps) {
			for (let i:number = 0; i < maps.length; ++i) {
				const taskName:string = registerHtml(projectName, maps[i], i);
				htmlTaskNames.push(taskName);
			}
		}
	}

	const taskName:string = projectName + '-watch';
	const projectSrc:string = createPath('..', path.src, projectName);
	gulp.task(taskName, function():void {
		if (typeScriptTaskNames.length > 0) {
			gulp.watch(projectSrc + '/**/*.ts', gulp.series(typeScriptTaskNames));
		}
		if (sassTaskNames.length > 0) {
			gulp.watch(projectSrc + '/**/*.scss', gulp.series(sassTaskNames));
		}
		if (htmlTaskNames.length > 0) {
			gulp.watch(projectSrc + '/**/*.html', gulp.series(htmlTaskNames));
		}
	});
	watchTaskNames.push(taskName);
}

function registerServer():void {
	const optopn:any = config.server;
	if (optopn) {
		optopn.root = '../' + path.dst;
		optopn.host = getOption(optopn, 'host', 'localhost');
		optopn.port = getOption(optopn, 'port', 8000);
		optopn.livereload = getOption(optopn, 'livereload', true);

		console.log(indent + 'Starting server');
		gulp.task('server', function():void {
			connect.server(optopn);
		});
		watchTaskNames.push('server');
	}
}

function run():void {
	registerServer();

	console.log(indent + 'Registering projects');
	for (let i:number = 0; i < projects.length; ++i) {
		registerProject(projects[i]);
	}

	gulp.task('watch', gulp.parallel(watchTaskNames));
	gulp.task('default', gulp.parallel(defaultTaskNames));
}

//----------------------------------------
run();