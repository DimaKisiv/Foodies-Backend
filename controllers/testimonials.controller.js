import * as TestimonialsService from "../services/testimonials.service.js";

export async function listTestimonials(req, res, next) {
  try {
    const items = await TestimonialsService.listTestimonials();
    res.json({ items, total: items.length });
  } catch (err) {
    next(err);
  }
}
