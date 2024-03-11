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
    currentPassword: { type: 'string' },
    newPassword: { type: 'string' },
  },
  required: ['currentPassword', 'newPassword'],
  additionalProperties: false,
  errorMessage: {
    additionalProperties: 'Additional properties are not allowed',
  }
}

module.exports = {
  updateUserInfoSchema,
  updateUserPasswordSchema,
};
