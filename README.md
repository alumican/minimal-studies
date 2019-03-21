# minimal-studies
JavaScriptでビジュアルプロトタイピングを手っ取り早く始めるためのプロジェクトテンプレート、およびそのコンパイルシステム

This is a project template for quickly starting visual prototyping with JavaScript, including build system.

## Feature
- `TypeScript` + `Sass`
- `Gulp 4`による自動コンパイル、ローカルサーバ起動

## Getting Started
1. `node.js`をインストールする https://nodejs.org/
2. [ここからzipをダウンロード](https://github.com/alumican/minimal-studies/archive/master.zip)して解凍する
3. ターミナルで`minimal-studies-master`ディレクトリに移動する
4. ターミナルで`./build.sh`を実行してインストールする
5. ターミナルで`./build.sh watch`を実行するとファイル監視を始め、サーバが起動する
6. プロジェクト`src/xxx-example`に含まれる`.ts` `.scss` `.html`を更新すると、該当プロジェクトが`deploy`以下に自動的にコンパイルされる
7. http://localhost:8765/ へアクセスして実行結果を確認する

## Create Your Project
1. `src`ディレクトリ直下に、任意の名前のディレクトリを作成する
2. `build/config.json`の`projects`に、作成したディレクトリ名を追加する
3. 必要に応じて、TypeScript、Sass、HTMLのマッピングルールを追加する
4. すでに`./build.sh watch`をおこなっている場合は、一度終了させて再度watchすることで新規プロジェクトが監視対象になる

## Build Commands
`minimal-studies`ディレクトリで以下のコマンドを実行できる

### ./build.sh
コンパイル環境が未インストールの場合はインストールとコンパイルをおこなう。既に環境がインストールされている場合はコンパイルのみをおこなう

### ./build.sh watch
`.ts` `.scss` `.html`の変更を検出して自動的にコンパイルをおこなう。ローカルサーバの起動をおこなう。`ctrl + c`で終了する

### ./build.sh install
コンパイル環境のインストールをおこなう

### ./build.sh uninstall
コンパイル環境のアンインストールをおこなう

## Settings
`build/config.json`によって、プロジェクトの定義やのコンパイルのルールを指定する

例
```
{
	"path": {
		"src": "src",
		"dst": "deploy"
	},
	"projects": [
		{ "name": "empty-example" },
		{ "name": "paper-example",
		  "js": [
			  { "src": "script/index.ts", "dst": "js/index.js" },
			  { "src": "script/sub.ts", "dst": "js/sub.js" }
		  ]
		}
	],
	"default": {
		"js": [{ "src": "script/main.ts", "dst": "js/main.js" }],
		"css": [{ "src": "style/main.scss", "dst": "css/main.css" }],
		"html": [
			{ "src": "index.html", "dst": "index.html" },
			{ "src": "about.html", "dst": "about.html" }
		]
	},
	"server": {
		"host": "localhost",
		"port": 8765,
		"livereload": true
	},
	"typeScript": {
		"target": "ES5",
		"lib": ["es6", "dom"],
		"types": ["jquery", "paper", "pixi.js", "three", "d3", "modernizr", "dat.gui", "stats.js"],
		"forceConsistentCasingInFileNames": true,
		"alwaysStrict": true,
		"removeComments": true,
		"declaration": false,
		"sourceMap": true,
		"minify": false
	},
	"sass": {
		"outputStyle": "expanded",
		"sourceMap": false
	}
}
```

### パス（必須）
プロジェクトのソースと出力それぞれのルートディレクトリを指定する

`src`（必須）プロジェクトのソースを配置するルートディレクトリ   
`dst`（必須）プロジェクトの出力を配置するルートディレクトリ   
```
"path": {
	"src": "src",
	"dst": "deploy"
},
```

### プロジェクト一覧（必須）
コンパイルに含めたいプロジェクトを指定する

`name`（必須）プロジェクトのディレクトリ名  
`js`（オプション）デフォルトを置き換える`.ts` → `.js` のマッピングルール（記述方法は次項参照）  
`css`（オプション）デフォルトを置き換える`.scss` → `.css` のマッピングルール（記述方法は次項参照）  
`html`（オプション）デフォルトを置き換える`.html` → `.html` のマッピングルール（記述方法は次項参照）  
```
"projects": [
	{ "name": "empty-example" },
	{ "name": "paper-example",
		"js": [
			{ "src": "script/index.ts", "dst": "js/index.js" },
			{ "src": "script/sub.ts", "dst": "js/sub.js" }
		]
	}
],
```

### デフォルトのマッピングルール（オプション）
ここに書いたマッピングルールは、各プロジェクトに共通で利用される。`default`を省略すると全てプロジェクトに個別にルールを記述する必要がある

各ルールにおいて、`src`は`path.src`で指定されたパスを、`dst`は`path.dst`で指定されたパスを基点とする

`js`（オプション）`.ts` → `.js` のマッピングルール（配列になっているので複数指定可能）   
`css`（オプション）`.scss` → `.css` のマッピングルール（配列になっているので複数指定可能）  
`html`（オプション）`.html` → `.html` のマッピングルール（配列になっているので複数指定可能）  
```
"default": {
	"js": [{ "src": "script/main.ts", "dst": "js/main.js" }],
	"css": [{ "src": "style/main.scss", "dst": "css/main.css" }],
	"html": [
		{ "src": "index.html", "dst": "index.html" },
		{ "src": "about.html", "dst": "about.html" }
	]
},
```

### ローカルサーバ情報（オプション）
`./build.sh watch`によって起動するローカルサーバの設定値。`server`自体を省略するとローカルサーバを立ち上げない  

`host`（オプション）ポスト名（デフォルト `localhost`）  
`port`（オプション）ポート番号（デフォルト `8000`）  
`livereload`（オプション）`true`の場合、コンパイル後にブラウザをリロードする（デフォルト `true`）  
```
"server": {
	"host": "localhost",
	"port": 8765,
	"livereload": true
},
```

### TypeScriptオプション（オプション）
`minify`（オプション）圧縮した`.min.js`を出力する場合は`true`（デフォルト `false`）  

その他のオプションは[TypeScript Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)を参照
```
"typeScript": {
	"target": "ES5",
	"lib": ["es6", "dom"],
	"types": ["jquery", "paper", "pixi.js", "three", "d3", "modernizr", "dat.gui", "stats.js"],
	"forceConsistentCasingInFileNames": true,
	"alwaysStrict": true,
	"removeComments": true,
	"declaration": false,
	"sourceMap": true,
	"minify": false
},
```

### Sassオプション（オプション）
`sourceMap`（オプション）ソースマップを出力する場合は`true`（デフォルト `false`）  

その他のオプションは[gulp-sass](https://www.npmjs.com/package/gulp-sass)を参照
```
"sass": {
	"outputStyle": "expanded",
	"sourceMap": false
}
```

## Using Libraries
`jQuery` `Paper.js` `PixiJS` `three.js` `D3.js` `modernizr` `dat.gui` `stats.js`はデフォルトで含まれてので、利用する場合は`.ts`の中でそれぞれ以下のように参照する。また、別途HTMLに`<script>`タグで`lib`以下の該当の`.js`を読み込む
```
/// <reference types="jquery" />
/// <reference types="paper" />
/// <reference types="pixi.js" />
/// <reference types="three" />
/// <reference types="d3" />
/// <reference types="modernizr" />
/// <reference types="dat.gui" />
/// <reference types="stats.js" />
```

### 新たな型定義を@typesから追加する
[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)に公開されている型定義を追加する場合、`build/config.json`の`typeScript.types`にパッケージ名を追記してから`build install.sh`するとインストールされるので、利用側の`.ts`で以下のように宣言して使う
```
/// <reference types="xxx" />
```

### 新たな型定義を直接追加する
独自の`d.ts`やDefinitelyTypedにない型定義は、`deploy/lib`や各々のプロジェクトディレクトリの任意の場所において、利用側の`.ts`で以下のようにパスを通して使う
```
/// <reference path="path/to/xxx.d.ts" />
```

## Lisence

本リポジトリ内の独自のコードは、MITライセンスとする。ただし`jQuery` `Paper.js` `PixiJS` `three.js` `D3.js` `modernizr` `dat.gui` `stats.js`などの各ライブラリに関するものは、各ライブラリそれぞれのライセンスに準ずる  

The original codes in this repository are licensed under the MIT.
However, for libraries such as `jQuery` `Paper.js` `PixiJS` `three.js` `D3.js` `modernizr` `dat.gui` `stats.js` and so on, it follow each license of each library.

**MIT Lisence**

Copyright 2019, Yukiya Okuda http://alumican.net

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Contact
[@alumican_net](https://twitter.com/alumican_net)