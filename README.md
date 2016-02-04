# pi-maps


## Setup

### Easy install

For a quick setup, just run:
  -  `make setup` for Debian flavors, or OSX (requires Macports)


### Manual install
1. Install nodejs (preferably from own repo) and npm:

        add-apt-repository ppa:chris-lea/node.js && apt-get update
        apt-get install nodejs

2. Install mongodb. Needed for our database:

        apt-get install mongodb

  For OSX, I recommand using [MacPorts](http://www.macports.org/) for an easy install:

        port install mongodb

3. Set node environment ($NODE_ENV):

        NODE_ENV=development

4. Install all node modules. A list is available further down.

        npm install


## Dependencies
This is a list of the modules we use (package.json):

* [express](https://www.npmjs.org/package/express) - web development framework
* [connect](https://www.npmjs.org/package/connect) - high performance middleware framework
* [mongoose](https://www.npmjs.org/package/mongoose) - MongoDB ODM


Use package.json to install them all:

        npm install package.json


### Running the application

To start the application run:

`make run`

Server will start and you can access it at: http://localhost:3000
For the remote, please visit: http://localhost:3000/remote
