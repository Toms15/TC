# TC
TC front-end static environment using pug.

## Features
- Scss
- Pug templating language
- Autoprefixer
- Imagemin
- BrowserSync

## Get started
Clone this repo on your machine and run inside of it:

	npm install

or if you prefer Yarn

	yarn install

Once you have installed the dependencies you can run

	gulp

to instantly open up a dev server with BrowserSync and start coding.

## Installing a package
TC has already the latest Foundation Zurb stable release and jQuery included in dependencies.

To install a dependency just run

	bower install <package-name> --save

or

	yarn add <package-name>

## Build for production
When done with coding you can run

	gulp build

to minimize and optimize all assets and images.