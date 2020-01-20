import arg from 'arg';
import inquirer from 'inquirer';
import { createProject, addController } from './main';
import packageJsonInfo from './../package.json';
import chalk from 'chalk';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--version': Boolean,
            '-v': '--version',
            '--mongo': Boolean,
            '-m': '--mongo'
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        version: args['-v'] || args['--version'] || false,
        mongo: args['--mongo'] || args['-m'] || false,
        actions: args._[0],
        nameAction: args._[1]
    }
}

async function promptForMissingOptions(options) {
    const questions = [];
    options.actions = options.actions === 'new' || options.actions === 'create' ? options.actions : undefined;
    if (!options.actions) {
        console.log(
`
Usage: mj <command>

commands:
    --version: console the version
    -v: alias --version
    new <project-name>: create a new project
    create <controller-name>: create a new controller and service

MJ-Framework@${packageJsonInfo.version}
`);
    } else {
        if (!options.nameAction) {
            questions.push({
                type: 'input',
                name: 'nameAction',
                message: 'name your action',
                default: 'Name'
            });
        }
    }

    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        actions: options.actions || answers.actions,
        nameAction: options.nameAction || answers.nameAction
    }
}

export async function cli(args) {
    let options = parseArgumentsIntoOptions(args);
    if (options.version) {
console.log('%s %s',
chalk.yellow.bold(
`
                      MJ-Framework version: ${packageJsonInfo.version}`),
chalk.magenta.bold(
`
• ▌ ▄ ·.  ▐▄▄▄    ·▄▄▄▄▄▄   ▄▄▄· • ▌ ▄ ·. ▄▄▄ .▄▄▌ ▐ ▄▌      ▄▄▄  ▄ •▄ 
·██ ▐███▪  ·██    ▐▄▄·▀▄ █·▐█ ▀█ ·██ ▐███▪▀▄.▀·██· █▌▐█▪     ▀▄ █·█▌▄▌▪
▐█ ▌▐▌▐█·▪▄ ██    ██▪ ▐▀▀▄ ▄█▀▀█ ▐█ ▌▐▌▐█·▐▀▀▪▄██▪▐█▐▐▌ ▄█▀▄ ▐▀▀▄ ▐▀▀▄·
██ ██▌▐█▌▐▌▐█▌    ██▌.▐█•█▌▐█ ▪▐▌██ ██▌▐█▌▐█▄▄▌▐█▌██▐█▌▐█▌.▐▌▐█•█▌▐█.█▌
▀▀  █▪▀▀▀ ▀▀▀•    ▀▀▀ .▀  ▀ ▀  ▀ ▀▀  █▪▀▀▀ ▀▀▀  ▀▀▀▀ ▀▪ ▀█▄▀▪.▀  ▀·▀  ▀
`
), `

github: https://github.com/MarcosRochaPrimordial/mj-framework`);

    } else {
        options = await promptForMissingOptions(options);
        if (options.actions === 'new') {
            await createProject(options)
        } else if (options.actions === 'create') {
            await addController(options);
        }
    }
}