import Joi from "joi";

export const createRecipeSchema = Joi.object({
  title: Joi.string().trim().min(1).required(),
  description: Joi.string().trim().min(10).required(),
  instructions: Joi.string().trim().min(10).required(),
  // thumb is provided via file upload, not in body
  time: Joi.number().integer().min(1).allow(null),
  category: Joi.string().trim().min(1).required(),
  area: Joi.string().trim().min(1).required(),
  ingredients: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().trim().min(1).required(),
        measure: Joi.string().allow("", null),
      })
    )
    .min(1)
    .required(),
}).required();

export const updateRecipeSchema = Joi.object({
  title: Joi.string().trim().min(1),
  description: Joi.string().trim().min(10),
  instructions: Joi.string().trim().min(10),
  // thumb is provided via file upload, not in body
  time: Joi.number().integer().min(1).allow(null),
  category: Joi.string().trim().min(1),
  area: Joi.string().trim().min(1),
  ingredients: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().trim().min(1).required(),
        measure: Joi.string().allow("", null),
      })
    )
    .min(1),
}).min(1);
