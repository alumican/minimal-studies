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

## Lisence

本リポジトリ内の独自のコードは、MITライセンスとする

ただし`jQuery` `Paper.js` `PixiJS` `three.js` `D3.js`などの各ライブラリに関しては、各ライブラリそれぞれのライセンスに準ずる