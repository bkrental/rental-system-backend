const addressSchema = {
  type: "object",
  properties: {
    province: { type: "string" },
    district: { type: "string" },
    ward: { type: "string" },
    street: { type: "string" },
    number: { type: "string" },
  },
  required: ["province", "district", "ward", "street"],
};

const locationSchema = {
  type: "object",
  properties: {
    type: { type: "string", enum: ["Point"] },
    coordinates: { type: "array", items: { type: "number" } },
  },
  required: ["type", "coordinates"],
};

const contactSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    phone: { type: "string" },
  },
  required: ["name", "phone"],
};

const postSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    area: { type: "number" },
    property_type: { type: "string" },
    transaction_type: { type: "string", enum: ["rent", "sale"] },
    price: { type: "number" },
    displayed_address: { type: "string" },
    address: addressSchema,
    location: locationSchema,
    thumbnail: { type: "string" },
    images: {
      type: "array",
      items: { type: "string" },
    },
    bedrooms: { type: "number" },
    bathrooms: { type: "number" },
    owner: { type: "string" },
    contact: contactSchema,
    post_url: { type: "string" },
    source: { type: "string" },
  },
};

const createPostSchema = {
  ...postSchema,
  required: [
    "name",
    "description",
    "property_type",
    "transaction_type",
    "price",
    "address",
    "thumbnail",
    "displayed_address",
  ],
  additionalProperties: false,
};

const createPostBulkSchema = {
  type: "array",
  items: createPostSchema,
};

const updatePostSchema = {
  ...postSchema,
  required: [],
  additionalProperties: false,
};

module.exports = { createPostSchema, updatePostSchema, createPostBulkSchema };
