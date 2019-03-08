# minimal-studies
JavaScriptで表現プロトタイピングを大量におこないたい人が、手っ取り早く始められるためのプロジェクトテンプレート、およびそのコンパイルシステム

## Feature
- `TypeScript` + `sass`
- `Gulp.js`による自動コンパイル、ローカルサーバ起動

## Getting Started
1. `node.js`をインストールする  
https://nodejs.org/ja/
2. ターミナルで`minimal-studies`ディレクトリに移動する
3. ターミナルで`./build.sh`を実行してインストールする
4. ターミナルで`./build.sh watch`を実行するとファイル監視を始め、サーバが起動する
5. プロジェクト`○○○-example`に含まれる`.ts` `.scss` `.html`を更新すると、該当プロジェクトが`deploy`以下に自動的にコンパイルされる
6. http://localhost:8765/ へアクセスして実行結果を確認する

## Create Your Project
1. `src`ディレクトリ直下に、任意の名前のディレクトリを作成する
2. `build/config.json`の`projects`に、作成したディレクトリ名を追加する
3. 必要に応じて、TypeScript、sass、htmlのマッピングルールを追加する
4. すでに`./build.sh watch`をおこなっている場合は、一度終了させて再度watchすることで新規プロジェクトが監視対象になる

## Gulp Commands
`minimal-studies`ディレクトリで以下のコマンドを実行できる

### ./build.sh
コンパイル環境が未インストールの場合はインストールをおこない、それからコンパイルする。既に環境がインストールされている場合はコンパイルのみをおこなう

### ./build.sh watch
`.ts` `.scss` `.html`の変更を検出して自動的にコンパイルをおこなう。ローカルサーバの起動をおこなう。`ctrl + c`で終了する

### ./build.sh install
コンパイル環境のインストールをおこなう

### ./build.sh install
コンパイル環境のアンインストールをおこなう

## Config.json
プロジェクトのコンパイルルールを指定する

例
```
{
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
	"path": {
		"src": "../src",
		"deploy": "../deploy"
	},
	"server": {
		"host": "localhost",
		"port": 8765,
		"livereload": true
	},
	"typeScript": {
		"target": "ES5",
		"lib": ["es6", "dom"],
		"types": ["modernizr", "jquery", "paper", "pixi.js", "three", "d3"],
		"alwaysStrict": true,
		"forceConsistentCasingInFileNames": true
	}
}
```

### プロジェクト一覧（必須）
コンパイルに含めたいプロジェクトをリストする

`name`（必須）プロジェクトのディレクトリ名  
`js`（オプション）デフォルトを置き換える`.ts` → `.js` のマッピングルール（記述方法は次項参照）  
`css`（オプション）デフォルトを置き換える`.scss` → `.css` のマッピングルール（記述方法は次項参照）  
`html`（オプション）デフォルトを置き換える`.html` → `.html` のマッピングルール（記述方法は次項参照）  
```
{
	"projects": [
		{ "name": "empty-example" },
		{ "name": "paper-example",
		  "js": [
			  { "src": "script/index.ts", "dst": "js/index.js" },
			  { "src": "script/sub.ts", "dst": "js/sub.js" }
		  ]
		}
	],
}
```

### デフォルトのマッピングルール（オプション）
ここに書いたマッピングルールは、各プロジェクトに共通で利用される。`default`を省略すると全てプロジェクトに個別にルールを記述する必要がある

各ルールにおいて、`src`は`src/プロジェクトディレクトリ`以下のパス、`dst`は`deploy/プロジェクトディレクトリ`以下のパスから始まる

`js`（オプション）`.ts` → `.js` のマッピングルール番号（デフォルト `8000`）  
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
以下を参照  
https://www.typescriptlang.org/docs/handbook/compiler-options.html
```
	"typeScript": {
		"target": "ES5",
		"lib": ["es6", "dom"],
		"types": ["modernizr", "jquery", "paper", "pixi.js", "three", "d3"],
		"alwaysStrict": true,
		"forceConsistentCasingInFileNames": true
	}
```

## Lisence

本リポジトリ内の独自のコードは、MITライセンスとする

ただし`jQuery` `Paper.js` `PixiJS` `three.js` `D3.js`などの各ライブラリに関しては、各ライブラリそれぞれのライセンスに準ずる

MIT Lisence

Copyright 2018, Yukiya Okuda  
http://alumican.net

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.