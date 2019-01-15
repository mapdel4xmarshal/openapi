
{{#each route}}
{{#each this.properties}}
/**
 * {{summary}}
 {{#if parameters}}
 {{#each parameters}}
 * @param {{name}}
 {{/each}}
 {{/if}}
 * return
 */
module.exports.{{operationId}} = async (parameters) => {
    /**
     * Implement business logic
     */
    return {status : 200, parameters};
};

{{/each}}
{{/each}}
