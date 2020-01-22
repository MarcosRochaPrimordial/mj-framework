# Maria Julia Framework

MJ-Framework is a Command Line Interface (CLI) to bootstrap and manage projects with NodeJS and TypeScript.

# Installation

```
npm install -g mj-framework
```

# Info

MJ-Framework uses two packages:

[decorated-router](https://www.npmjs.com/package/decorated-router) and 
[decorated-mongo](https://www.npmjs.com/package/decorated-mongo)

Please, read both documentation.

# Basic usage

## Creating a project

```
# Creates a new project with specified name
mj new <PROJECT-NAME>

# Creates a new project with specified name also add to the project the package decorated-mongo
mj new <PROJECT-NAME> --mongo
```

## Creating a new controller and service

```
# Inside the main folder
# Creates a new Controller and Service with specified name
mj create <CONTROLLER-NAME>
```