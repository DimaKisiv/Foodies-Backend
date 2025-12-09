import { Testimonial, User } from "../models/index.js";

export async function listTestimonials() {
  return await Testimonial.findAll({
    include: [{ model: User, as: "owner" }],
    order: [["created_at", "DESC"]],
  });
}
