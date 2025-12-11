import Joi from "joi";

export const createRecipeSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().allow("", null),
  instructions: Joi.string().allow("", null),
  thumb: Joi.string().uri().allow("", null),
  time: Joi.number().integer().min(1).allow(null),
  category: Joi.string().allow("", null),
  area: Joi.string().allow("", null),
  ingredients: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().min(1).required(),
        measure: Joi.string().allow("", null),
      })
    )
    .default([]),
}).required();
