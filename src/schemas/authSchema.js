const signUpSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    phone: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
  required: ["phone", "password", "name"],
  additionalProperties: false,
};

const loginSchema = {
  type: "object",
  properties: {
    phone: { type: "string" },
    password: { type: "string" },
  },
  required: ["phone", "password"],
  additionalProperties: false,
};

module.exports = { signUpSchema, loginSchema };
