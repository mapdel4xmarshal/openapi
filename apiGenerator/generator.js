const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const URL = require('url');
const Handlebars = require('./handlebarsHelper');

const CONFIG = require("./configs/config");
const APIParser = require('./parser');
const validator = require('./validator');

class Generator {
    constructor(apiDocPath) {
        this.apiDocPath = apiDocPath || CONFIG.API_DOC_PATH;
        this.parsedAPIDoc = {};
        this.paths = {};
        this.routes = {};
        this.templates = {
            app: fs.readFileSync(path.resolve(__dirname, `${CONFIG.TEMPLATES_DIR}/app.js`), 'utf8'),
            route: fs.readFileSync(path.resolve(__dirname, `${CONFIG.TEMPLATES_DIR}/routes.js`), 'utf8'),
            service: fs.readFileSync(path.resolve(__dirname, `${CONFIG.TEMPLATES_DIR}/services.js`), 'utf8')
        }
    }

    async generate() {
        this.parsedAPIDoc = await new APIParser(this.apiDocPath).parse();
        const validationResponse = await validator(this.parsedAPIDoc);
        if (validationResponse.errors.length === 0) {
            await this.generateRoutes();
            this.generateAppFile(this.routes);

            if (Object.keys(this.routes).length > 0) {
                for (let [route, property] of Object.entries(this.routes)) {
                    this.generateRouteFiles(route, property);
                    this.generateServiceFiles(route, property);
                }
            }
        }
        else console.error("API template contains some errors. Operation Aborted!", validationResponse.errors);
    }

    async generateAppFile(routes) {
        const basePath = this.getBaseUrl(); console.log("basePath",basePath);

        const template = this.compileTemplate('app', {routes, basePath});
        const file = path.resolve(__dirname, `${CONFIG.DESTINATION_PATH}/app.js`);
        await fse.outputFile(file, template, "utf8");
    }

    async generateRouteFiles(route, property) {
        const template = this.compileTemplate('route', {route: property});
        const file = path.resolve(__dirname, `${CONFIG.DESTINATION_PATH}/${route}/${route}.route.js`);
        await fse.outputFile(file, template, "utf8");
    }

    async generateServiceFiles(route, property) {
        const file = path.resolve(__dirname, `${CONFIG.DESTINATION_PATH}/${route}/${route}.service.js`);
        const fileExist = await fs.existsSync(file);
        if (fileExist) return;

        const template = this.compileTemplate('service', {route: property});
        await fse.outputFile(file, template, "utf8");
    }

    compileTemplate(type, options) {
        const template = Handlebars.compile(this.templates[type]);
        return template(options);
    }

    getBaseUrl() {
        let baseUrl = "";
        if (this.parsedAPIDoc && this.parsedAPIDoc.servers) {
            const url = URL.parse(this.parsedAPIDoc.servers[0].url);
            baseUrl = url.pathname.replace(/\//g, '');
        }
        return baseUrl;
    }

    generateRoutes() {
        if (this.parsedAPIDoc && this.parsedAPIDoc.paths) {
            for (let [path, properties] of Object.entries(this.parsedAPIDoc.paths)) {
                const fileName = path.split('/')[1];
                this.routes[fileName] = this.routes[fileName] || [];
                this.routes[fileName].push({path, fileName, properties});
            }
        }
    }
}

new Generator().generate();

//module.exports = Generator;