# NODE.JS API STARTER WITH TYPESCRIPT

<b>Description:</b> A starter project for building Node.js APIs with TypeScript, Express, MongoDB, Mongoose.

## How To Use

### 1. From your command line, first clone this repository:

```git clone https://github.com/watat83/nodejs-api-typescript.git```

Then you can install the dependencies using npm or yarn:

```npm install``` or ```yarn install```

### 2. Rename .env.example file in the root directory to .env and replace the string `YOUR_MONGODB_ATLAS_URL` with your own MongoDB Atlas URL:

```MONGODB_ATLAS_URL=<YOUR_MONGODB_ATLAS_URL>```

### 3. Run the development server:

```npm run test``` / ```npm run dev``` / ```npm run prod```

The command will execute one of the following scripts:

```"test": "ts-node ./app/server.ts",``` or

```"dev": "tsc && nodemon ./dist/server.js",``` or

```"prod": "tsc && nodemon ./dist/server.js",```

The command will 
- Run the typescript compiler (ts-node / tsc), 
- Create a `./dist` folder that will store all the compiled JavaScript files,
- Compile all the .ts files from `./app` folder into .js files in the `./dist` folder. See config instructions in the [`tsconfig.json`](./tsconfig.json) file, **compilerOptions{}**.
- Run the `server.ts` or `server.js` file to launch the server on the appropriate port.

### 4. Open [http://localhost:<PORT_SPECIFIED>](http://localhost:<PORT_SPECIFIED>) with your browser to see the result.


<hr>

(c) 2022 by [Chris Nzouat](https://nzouat.com) - All rights reserved. 

Licensed under MIT

