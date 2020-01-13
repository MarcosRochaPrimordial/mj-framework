import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import { projectInstall } from 'pkg-install';
import Listr from 'listr';

const access = promisify(fs.access);
const writeFile = promisify(fs.writeFile);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false
    });
}

function setTargetDirectoryToOptions(options) {
    return {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd()
    }
}

function capitalizeFirstLetter(str) {
    if (typeof str === 'string') {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return str;
}

function capitalizeFirstLetterOptions(options) {
    return {
        ...options,
        nameActionCapitalize: capitalizeFirstLetter(options.nameAction)
    }
}

async function createNewController(options) {
    return writeFile(`${options.targetDirectory}/src/app/application/controller/${options.nameActionCapitalize}Controller.ts`,
    `import { Controller } from 'decorated-router';
    
@Controller({
    url: '/${options.nameAction.toLowerCase()}',
    cors: '*',
    auth: null
})
export class ${options.nameActionCapitalize}Controller {
    constructor() { }
}
`)
}

async function createNewService(options) {
    return writeFile(`${options.targetDirectory}/src/app/infra/service/${options.nameActionCapitalize}Service.ts`,
    `import { Injectable } from 'decorated-router';

@Injectable()
export class ${options.nameActionCapitalize}Service {

}    
`)
}

function addNewControllerToLoader(options) {
    const loader = `${options.targetDirectory}/src/Loader.ts`;
    const data = fs.readFileSync(loader, 'utf-8');
    const dataSplited = data.split('controllers: [');
        const newLoader = `import { ${options.nameActionCapitalize}Controller } from './app/application/controller/${options.nameActionCapitalize}Controller'
${dataSplited[0]}controllers: [
        ${options.nameActionCapitalize}Controller,${dataSplited[1]}`;
    
    return writeFile(`${options.targetDirectory}/src/Loader.ts`, newLoader);
}

export async function addController(options) {
    options = setTargetDirectoryToOptions(options);
    options = capitalizeFirstLetterOptions(options);
    const tasks = new Listr([
        {
            title: 'Creating new controller',
            task: () => createNewController(options)
        },
        {
            title: 'Creating new service',
            task: () => createNewService(options)
        },
        {
            title: 'Insert into Loader',
            task: () => addNewControllerToLoader(options)
        }
    ]);

    await tasks.run();

    console.log('Ready');
    return true;
}

export async function createProject(options) {
    options = setTargetDirectoryToOptions(options);
    options.targetDirectory = `${options.targetDirectory}/${options.nameAction}`;

    const templateDir = path.resolve(
        __dirname,
        '../templates'
    );
    options.templateDirectory = templateDir;
    try {
        await access(templateDir, fs.constants.R_OK);
    } catch(err) {
        console.error('%s Invalid template directory', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const tasks = new Listr([
        {
            title: 'Copy project files',
            task: () => copyTemplateFiles(options)
        },
        {
            title: 'Installing project',
            task: () => writeFile(`${options.targetDirectory}/package.json`, `
{
    "name": "${options.nameAction}",
    "version": "1.0.0",
    "description": "",
    "main": "src/Loader.ts",
    "scripts": {
        "start": "",
        "build": "tsc"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "bcryptjs": "^2.4.3",
        "decorated-mongo": "^1.1.4",
        "decorated-router": "^1.3.7",
        "dotenv": "^8.2.0",
        "jsonwebtoken": "^8.5.1"
    },
    "devDependencies": {
        "@types/bcryptjs": "^2.4.2",
        "@types/node": "^13.1.1",
        "ts-node": "^8.5.4",
        "typescript": "^3.7.4"
    }
}`)
        },
        {
            title: 'Installing dependencies',
            task: () => projectInstall({
                cwd: options.targetDirectory
            })
        }
    ]);

    await tasks.run();

    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}