const Handlebars = require('handlebars');

/**
 * Capitalized string
 */
Handlebars.registerHelper("capitalize", function(word) {
    word = word.split('');
    word[0] = word[0].toUpperCase();
    return word.join('');
});

/**
 * Normalizes path name
 */
Handlebars.registerHelper("normalizePath", function(path, fileName) {
    if(path.indexOf('/') !== 0) path = `/${path}`;
    return path.replace('{', ':').replace('}', '').replace(`/${fileName}`, '/').replace("//", "/");
});

/**
 * Returns OK response status code
 */
Handlebars.registerHelper("getOkStatusCode", function(responses) {
    if(responses){
        return responses["201"]? 201 : responses["301"]? 301 : 200;
    }
    throw new Error("Response parameter is required!");
});

/**
 * Builds response structure
 */
Handlebars.registerHelper("getOkStatusBody", function(responses) {
    if(responses){
        const response = responses["200"] || responses["201"] || responses["301"] || responses["default"];
        if(!response || !response.content) return "{}";
        const content = response.content;
        const firstObject = Object.keys(content)[0];
        const schemaType = content[firstObject].schema.type || "object";

        let body = "{";

        if(content[firstObject].schema.properties) {
            for (let key in content[firstObject].schema.properties) {
                body += `${key}: result.${key}, `;
            }
        }

        body += '}';
        return body.replace(', }', '}');
    }
    throw new Error("Response parameter is required!");
});

/**
 * Dereferences request parameters
 */
Handlebars.registerHelper("parameterLocation", function(location, name) {
    switch (location){ //TODO : refactor
        case "query" : return `query.${name}`;
        case "header" : return new Handlebars.SafeString(`header["${name}"]`);
        case "path" : return `params.${name}`;
        case "body" : return `body`
    }
});

/**
 * Removes escape parameters in comments
 */
Handlebars.registerHelper("escape", function(description) {
    if(typeof description == "string")description = description.replace(/\r?\n/g, '');
    return new Handlebars.SafeString(description);
});

module.exports = Handlebars;