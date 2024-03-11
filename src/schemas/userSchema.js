const updateUserInfoSchema = {
  type: 'object',
  properties: {
    avatar: { type: 'string' },
    rating: {
      type: 'object',
      properties: {
        score: {
          type: 'number',
          minimum: 0,
        },
        count: { type: 'number' },
      },
    }
  },
  additionalProperties: false,
  errorMessage: {
    additionalProperties: 'Additional properties are not allowed - Can only update "avatar" and "rating" fields',
  }
};


const updateUserPasswordSchema = {
  type: 'object',
  properties: {
    password: { type: 'string' },
  },
  required: ['password'],
  additionalProperties: false,
  errorMessage: {
    required: {
      newPassword: 'New password is required',
    },
    additionalProperties: 'Additional properties are not allowed - Can only update "password" field',
  }
}

module.exports = {
  updateUserInfoSchema,
  updateUserPasswordSchema,
};
