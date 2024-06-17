import { Request, Response } from 'express';
import { Category, CategoryDocument } from '../models/Category';
import { QueryRequest, UserRequest } from '../@types';

const categoryPaginator = async (req: Request, totalElements: number = 9) => {
  let skipIndex: number = 0;
  let totalPages: number = 0;
  let totalCategories: number = 0;
  try {
    const { page = 1, limit = totalElements, searchTerm = '' }: QueryRequest = req.query;
    skipIndex = (page - 1) * limit;
    totalCategories = await Category.countDocuments({
      name: { $regex: searchTerm, $options: 'i' },
    });
    totalPages = Math.ceil(totalCategories / limit);
    totalElements = limit;
  } catch (err) {
  }
  return [skipIndex, totalElements, totalPages, totalCategories]
}

exports.searchCategories = async (req: Request, res: Response) => {
  try {
    const { searchTerm = '' }: QueryRequest = req.query;
    const categories = await Category.find({ name: { $regex: searchTerm, $options: 'i' } });
    res.json(categories);
  } catch (err) {
    if (err instanceof Error)
      res.status(500).json({ message: err.message });
  }
};

exports.getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};

exports.getCategories = async (req: Request, res: Response) => {
  try {
    const [skipIndex, totalElements, totalPages, totalCategories] = await categoryPaginator(req);
    const { searchTerm = '' }: QueryRequest = req.query;
    const categories = await Category.find({ name: { $regex: searchTerm, $options: 'i' } })
      .skip(skipIndex)
      .limit(totalElements)
      .sort({ createdAt: -1 });
    res.json({ categories, totalPages, totalCategories });
  } catch (err) {
    if (err instanceof Error)
      res.status(500).json({ message: err.message });
  }
};

exports.getCategoriesSummary = async (req: Request, res: Response) => {
  try {
    const [skipIndex, totalElements, totalPages, totalCategories] = await categoryPaginator(req, 12);
    const { searchTerm = '' }: QueryRequest = req.query;
    const categories = await Category.aggregate([
      {
        $match: {
          name: { $regex: searchTerm, $options: 'i' },
        },
      },
      {
        $lookup: {
          from: 'contents',
          localField: '_id',
          foreignField: 'category',
          as: 'contents',
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalContents: { $size: '$contents' },
          contentTypes: {
            image: { $size: { $filter: { input: '$contents', as: 'content', cond: { $eq: ['$$content.type', 'image'] } } } },
            video: { $size: { $filter: { input: '$contents', as: 'content', cond: { $eq: ['$$content.type', 'video'] } } } },
            text: { $size: { $filter: { input: '$contents', as: 'content', cond: { $eq: ['$$content.type', 'text'] } } } },
          },
          image: 1,
          createdAt: 1
        },
      },
      { $skip: skipIndex },
      { $limit: totalElements },
    ]).sort({ createdAt: -1 })
    res.send({ categories, totalPages, totalCategories });
  } catch (err) {
    res.status(500).send('Error al obtener el resumen de categorías');
  }
};

exports.createCategory = async (req: UserRequest, res: Response) => {
  try {
    const { name, description }: CategoryDocument = req.body;
    const category = new Category({
      name,
      description,
      image: req.file ? req.file.filename : null
    });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};

exports.updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};

exports.deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};
