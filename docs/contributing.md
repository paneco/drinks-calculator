# Contributing
  **Do not open up a GitHub issue if the bug is a security vulnerability, instead contact us at support-remove@paneco.com.sg.**

## Table of Contents
- [Contributing](#contributing)
  - [Table of Contents](#table-of-contents)
  - [We Develop with Github](#we-develop-with-github)
  - [All Code Changes Happen Through Pull Requests](#all-code-changes-happen-through-pull-requests)
  - [Any contributions you make will be under the LGPL Software License](#any-contributions-you-make-will-be-under-the-lgpl-software-license)
  - [Report bugs using Github's issues](#report-bugs-using-githubs-issues)
  - [Developers](#developers)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Use a Consistent Coding Style](#use-a-consistent-coding-style)
    - [Running Tests](#running-tests)
    - [Making Changes & Debugging](#making-changes--debugging)
    - [Building](#building)
      - [Development Mode](#development-mode)
      - [Production Mode](#production-mode)
  - [License](#license)
  - [Final Words](#final-words)

We are all about collaboration and giving something back! In that spirit we want to make contributing to this project as easy as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

When contributing code such as an enhancement to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## We Develop with Github
We use github to host code, to track issues and feature requests, as well as accept pull requests.

## All Code Changes Happen Through Pull Requests
Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the LGPL Software License
In short, when you submit code changes, your submissions are understood to be under the same [LGPL v3 License](https://choosealicense.com/licenses/lgpl-3.0/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/paneco/drinks-calculator/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](); it's that easy!

**Do not open up a GitHub issue if the bug is a security vulnerability, instead contact us at support-remove@paneco.com.sg.**

**Ensure the bug was not already reported by searching on GitHub under Issues.**

If you're unable to find an open issue addressing the problem, open a new one. Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior that is not occurring.

Try to use one of the templates provided.

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can. 
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Developers
### Prerequisites
The following prerequisites are needed by `drinks-calculator`. See the documentation for each regarding installation. You will need to invoke `node` and `npm` on the command line. You can get that by installing Node.js.

* [nvm](https://github.com/nvm-sh/nvm)  - (OPTIONAL) This is not necessary but is **highly recommended** since the Node installation process installs npm in a directory with local permissions and can cause permissions errors when you run npm packages globally. **Using `nvm` allows you to switch versions on the command line easily**.
* [Node.js](https://nodejs.org/) **Recommended to install using nvm (or other Node package manager)**

The following prerequisites can be executed via npm:
* [stylelint](https://stylelint.io)
* [eslint](https://eslint.org/)
* [Google Closure Compiler](https://developers.google.com/closure/compiler/)
* [Jest](https://jestjs.io/)
* [cssnano](https://cssnano.co/)
* [htmlminifier](https://kangax.github.io/html-minifier/)
* [mustache](https://github.com/janl/mustache.js)

### Setup
Pull the code and create a branch.

Run the following command to get all the dependencies for this project:
```
npm install
```

### Use a Consistent Coding Style

* 2 spaces for indentation rather than tabs
* Run the following for code and style unification for javascript:
```
npm run eslint
```

* Run the following for style unification of CSS:
```
npm run stylelint
```

### Running Tests
To run the Jest tests use:
```
npm run test
```

### Making Changes & Debugging
If you want to make changes to the code and see them in real time without having to compile the code you can register a watcher and this will listen for changes you make. To register the watcher run the following command:
```
npm run watch
```
Once you have run the commmand you can make changes to the JS, CSS or Mustache templates and see them in real time on your browser for easy debugging.

### Building
There are 2 build options. One for development mode (which does not minify the code to make it easier to debug) and one for production. Execute the following command to see the full list of available scripts:
```
npm run
```

#### Development Mode
The simplest way to build the code is to run:
```
npm run build:dev
```
This will first clean up and remove the existing transpiled code and then copy the files to `.lib/dev` directory where you can execute the unminified version of the code. 

There are also watchers you can register that will auto-update code as you make changes.


#### Production Mode
The simplest way to build the code for release is to run:
```
npm run build:prod
```
This will first clean up and remove the existing transpiled code and then minify and copy the files to the `.lib/prod` directory where you can execute the unminified version of the code

## License
By contributing, you agree that your contributions will be licensed under its LGPL V3 License.

© [Paneco Singapore](https://www.paneco.com.sg)

## Final Words
Happy contributing, the Paneco.com Engineering Team