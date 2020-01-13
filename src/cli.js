import arg from 'arg';
import inquirer from 'inquirer';
import { createProject, addController } from './main';
import packageJsonInfo from './../package.json';

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--version': Boolean,
            '-v': '--version'
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return {
        version: args['-v'] || args['--version'] || false,
        actions: args._[0],
        nameAction: args._[1]
    }
}

async function promptForMissingOptions(options) {
    const questions = [];
    options.actions = options.actions === 'new' || options.actions === 'create' ? options.actions : undefined;
    if (!options.actions && !options.version) {
        questions.push({
            type: 'list',
            name: 'actions',
            message: 'Choose what you want to do',
            choices: ['new', 'create'],
            default: 'new'
        })
    }

    if (!options.nameAction) {
        questions.push({
            type: 'input',
            name: 'nameAction',
            message: 'name your action',
            default: 'Name'
        });
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
        console.log(
`MJ-Framework is in the version: ${packageJsonInfo.version}

github: https://github.com/MarcosRochaPrimordial/mj-framework
`
        );
    } else {
        options = await promptForMissingOptions(options);
        if (options.actions === 'new') {
            await createProject(options)
        } else if (options.actions === 'create') {
            await addController(options);
        }
    }
}