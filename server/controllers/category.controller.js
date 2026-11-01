import mongoose from "mongoose";
import categories from "../models/category.js";
import courses from "../models/course.js";

const CategoriesController = {
  get: async (req, res) => {
    try {
      const categoriesList = await categories.find({});
      res.status(200).json(categoriesList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const category = await categories.findById(id);
      if (!category) {
        return res.status(404).json({ message: "הקטגוריה לא נמצאה" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  post: async (req, res) => {
    const { categoryName } = req.body;
    try {
      const newCategory = new categories({
        categoryName,
      });
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  put: async (req, res) => {
    const { id } = req.params;
    const category = req.body;
    try {
      const updatedCategory = await categories.findByIdAndUpdate(id, category, {
        new: true,
        runValidators: true, // Mongoose לא מריץ ולידציה בעדכון אלא אם מבקשים במפורש
      });

      if (!updatedCategory) {
        return res.status(404).json({ message: "הקטגוריה לא נמצאה" });
      }

      res.status(200).json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  delete: async (req, res) => {
    const id = req.params.id;
    try {
      // חסימת המחיקה כדי לא להשאיר קורסים שמצביעים על קטגוריה שאינה קיימת
      const coursesCount = await courses.countDocuments({ categoryId: id });
      if (coursesCount > 0) {
        return res.status(409).json({
          message: `לא ניתן למחוק קטגוריה שיש בה ${coursesCount === 1 ? "קורס אחד" : `${coursesCount} קורסים`}`,
        });
      }

      const deletedCategory = await categories.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res.status(404).json({ message: "הקטגוריה לא נמצאה" });
      }
      res.status(200).json(deletedCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
export default CategoriesController;
