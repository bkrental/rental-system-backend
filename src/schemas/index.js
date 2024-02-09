const Ajv = require("ajv");
const { loginSchema, signUpSchema } = require("./authSchema");
const { createPostSchema, updatePostSchema } = require("./postSchema");

const ajv = new Ajv();

// The list of schemas to be added to the ajv instance
const schemas = {
  signUp: signUpSchema,
  login: loginSchema,
  createPost: createPostSchema,
  updatePost: updatePostSchema,
};

Object.keys(schemas).forEach((key) => {
  ajv.addSchema(schemas[key], key);
});

module.exports = ajv;
