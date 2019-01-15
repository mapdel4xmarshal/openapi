const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');
const RefParser = require('json-schema-ref-parser');

class APIParser {
    constructor(filePath) {
        this.filePath = filePath;
    }

    /**
     * Reads the content on API specification file
     * @param filePath
     * @returns {Promise<any>}
     */
    async getFileContent(filePath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.resolve(__dirname, filePath), (err, content) => {
                if (err) return reject(err);
                resolve(content);
            });
        });
    }

    /**
     * Converts API file content to proper JSON object
     * @param content
     * @returns {*}
     */
    parseContent(content) {
        content = content.toString('utf8');
        try {
            return JSON.parse(content);
        } catch (e) {
            return YAML.safeLoad(content);
        }
    }

    async deReference(json) {
        return RefParser.dereference(json, {
            dereference: {
                circular: 'ignore'
            }
        });
    }

    async bundle(json) {
        return RefParser.bundle(json, {
            dereference: {
                circular: 'ignore'
            }
        });
    }

    /**
     * Parses the API specification file
     * @returns {Promise<any>}
     */
    async parse() {
        let content, parsedContent, dereferencedJSON, bundledJSON;

        try {
            content = await this.getFileContent(this.filePath);
        } catch (e) {
            console.error('Can not load the content of the API specification file');
            console.error(e);
            return;
        }

        try {
            parsedContent = this.parseContent(content);
        } catch (e) {
            console.error('Can not parse the content of the API specification file');
            console.error(e);
            return;
        }

        try {
            dereferencedJSON = await this.deReference(parsedContent);
        } catch (e) {
            console.error('Can not dereference the JSON obtained from the content of the API specification file');
            console.error(e);
            return;
        }

        try {
            bundledJSON = await this.bundle(dereferencedJSON);
        } catch (e) {
            console.error('Can not bundle the JSON obtained from the content of the API specification file');
            console.error(e);
            return;
        }

        return JSON.parse(JSON.stringify(bundledJSON));
    }
}

module.exports = APIParser;