const express = require('express');
const router = express.Router();

const {{capitalize route.0.fileName}}Router = ({{capitalize route.0.fileName}}) => {
    {{capitalize route.0.fileName}} = {{capitalize route.0.fileName}} || require('./{{route.0.fileName}}.service');

    {{#each route}}
    {{#each this.properties}}
    /**
     * {{summary}}
     */
    router.{{@key}}('{{normalizePath ../path ../fileName}}', async (req, res, next) => {

        {{#if parameters}}
        const parameters = {
            {{#each parameters}}
            "{{name}}": req.{{parameterLocation in name}}, //{{escape description}}
            {{/each}}
        };

        {{/if}}
        try{
            const result = await {{capitalize ../fileName}}.{{operationId}}({{#if parameters}}parameters{{/if}});
            if(result.error)next(result.error);
            res.status({{getOkStatusCode responses}}).json({{getOkStatusBody responses}});
        }
        catch (e){
            next(e);
        }
    });

    {{/each}}
    {{/each}}
    return router;
}
module.exports = {{capitalize route.0.fileName}}Router;
