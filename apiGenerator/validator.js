const OpenAPISchemaValidator = require('openapi-schema-validator').default;

async function validator(apiDoc) {
    const validator = new OpenAPISchemaValidator({
        version: 3,
        version3Extensions: {}
    });

    return await validator.validate(apiDoc);
}

module.exports = validator;





