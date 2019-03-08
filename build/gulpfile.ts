'use strict';

import {Gulp} from "gulp";

type GulpModule = any;
type GetCommandsFunction = (srcFileName:string, dstFileName:string) => any[];

type Mapping = { src:string, dst:string };
type Project = { name:string, js:Mapping[], css:Mapping[], html:Mapping[] };
type ProjectDefault = { js:Mapping[], css:Mapping[], html:Mapping[] };
type Projects = Project[];
type Path = { src:string, deploy:string };
type TypeScriptOption = { target?:string, lib?:string[], types?:string[] };
type ServerOption = { host?:string, port?:number, root?:string, livereload?:boolean };
type Config = { projects:Projects, default:ProjectDefault, path:Path, typeScript:TypeScriptOption, server:ServerOption };





//----------------------------------------
// load modules

// common
const gulp:Gulp = require('gulp');
const plumber:GulpModule = require('gulp-plumber');
const tap:GulpModule = require('gulp-tap');
const sourcemaps:GulpModule = require('gulp-sourcemaps');
const connect:GulpModule = require('gulp-connect');

// TypeScript
const typescript:GulpModule = require('gulp-typescript');
const uglify:GulpModule = require('gulp-uglify');

// Sass
const sass:GulpModule = require('gulp-sass');
const cleanCss:GulpModule = require('gulp-clean-css');

// HTML
const removeEmptyLines:GulpModule = require('gulp-remove-empty-lines');
const stripComments:GulpModule = require('gulp-strip-comments');





//----------------------------------------
// load settings

const config:Config = require('./config.json');
const projects:Projects = config.projects;
const projectDefault:ProjectDefault = config.default;
const path:Path = config.path;

function getOption(option:any, key:string, defaultValue:any):any {
	return typeof option[key] !== 'undefined' ? option[key] : defaultValue;
}

const typeScriptOption:any = config.typeScript || {};
typeScriptOption.declaration = getOption(typeScriptOption, 'declaration', false);
typeScriptOption.removeComments = getOption(typeScriptOption, 'removeComments', true);
typeScriptOption.typeRoots = getOption(typeScriptOption, 'typeRoots', ['node_modules/@types/']);





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

	reset  : '\u001b[0m'
};

function getTypescriptOptions(outputFileName:string = ''):any {
	if (outputFileName != '') {
		typeScriptOption.outFile = outputFileName;
	}
	return typeScriptOption;
}

function registerTask(taskName:string, projectName:string, map:Mapping, getCommands:GetCommandsFunction) {
	const srcPath:string = path.src + '/' + projectName + '/' + map.src;
	const dstPath:string = path.deploy + '/' + projectName + '/' + map.dst;

	gulp.task(taskName, function() {
		const command:any = gulp.src(srcPath, { allowEmpty: true })
			.pipe(plumber())
			.pipe(tap(function(file:any, t:any) {
				const srcFileName:string = srcPath.split('/').pop();

				const dstPaths:string[] = dstPath.split('/');
				const dstFileName:string = dstPaths.pop();
				const dstDirectory:string = dstPaths.join('/');

				console.log(indent + 'Compiling \'' + color.blue + srcPath + color.reset + '\'' + color.lightGray + ' -> ' + color.reset + '\'' + color.blue + dstPath + color.reset + '\'');

				// create pipeline
				let pipeline:any = gulp.src(file.path);
				pipeline = pipeline.pipe(plumber());
				const commands:any[] = getCommands(srcFileName, dstFileName);
				for (let i:number = 0; i < commands.length; ++i) {
					pipeline = pipeline.pipe(commands[i]);
				}
				pipeline = pipeline.pipe(gulp.dest(dstDirectory));
				return pipeline;
			}));

		if (config.server && config.server.livereload) {
			command.pipe(connect.reload());
		}

		return command;
	});
	defaultTaskNames.push(taskName);
}

function registerTypeScript(projectName:string, map:Mapping, index:number):string {
	const taskName:string = projectName + '-typescript-' + index;
	registerTask(taskName, projectName, map, function(srcFileName:string, dstFileName:string):any[] {
		return [
			sourcemaps.init('./'),
			typescript(getTypescriptOptions(dstFileName)),
			sourcemaps.write('./')
		]
	});
	return taskName;
}

function registerSass(projectName:string, map:Mapping, index:number):string {
	const taskName:string = projectName + '-sass-' + index;
	registerTask(taskName, projectName, map, function(srcFileName:string, dstFileName:string):any[] {
		return [
			sass().on('error', sass.logError),
			cleanCss(),
			sourcemaps.write('./')
		];
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
			for (let i:number = 0; i < maps.length; ++i) {
				const taskName:string = registerTypeScript(projectName, maps[i], i);
				typeScriptTaskNames.push(taskName);
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
	const projectSrc:string = path.src + '/' + projectName;
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
		optopn.root = path.deploy;
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