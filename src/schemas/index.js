const fs = require("fs");
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
require("ajv-errors")(ajv);

const removeSchemaPostfix = (key) =>
  key.endsWith("Schema") ? key.slice(0, -6) : key;

const schemas = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith("Schema.js"))
  .reduce((schemas, file) => {
    const schema = require(`./${file}`);
    return { ...schemas, ...schema };
  }, {});

for (const key in schemas) {
  ajv.addSchema(schemas[key], removeSchemaPostfix(key));
}

module.exports = ajv;
