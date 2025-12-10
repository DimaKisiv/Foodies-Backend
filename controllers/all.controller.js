import * as UsersService from "../services/users.service.js";
import * as CategoriesService from "../services/categories.service.js";
import * as RecipesService from "../services/recipes.service.js";
import * as TestimonialsService from "../services/testimonials.service.js";
import * as IngredientsService from "../services/ingredients.service.js";

export async function listAll(req, res, next) {
  try {
    const [users, categories, recipes, testimonials] = await Promise.all([
      UsersService.listUsers({ page: 1, limit: 1000 }),
      CategoriesService.listCategories(),
      RecipesService.listRecipes({ page: 1, limit: 1000 }),
      TestimonialsService.listTestimonials(),
      IngredientsService.listIngredients({ page: 1, limit: 1000 }),
    ]);
    res.json({
      users,
      categories: { items: categories, total: categories.length },
      recipes,
      testimonials: { items: testimonials, total: testimonials.length },
    });
  } catch (err) {
    next(err);
  }
}
