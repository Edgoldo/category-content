const Category = require('../models/Category');

const categoryPaginator = async (req, totalElements = 9) => {
  let skipIndex = 0;
  let totalPages = 0;
  let totalCategories = 0;
  try {
    const { page = 1, limit = totalElements, searchTerm = '' } = req.query;
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

exports.searchCategories = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const regex = new RegExp(searchTerm, 'i');
    const categories = await Category.find({ name: { $regex: regex } });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const [skipIndex, totalElements, totalPages, totalCategories] = await categoryPaginator(req);
    const { searchTerm } = req.query;
    const regex = new RegExp(searchTerm, 'i');
    const categories = await Category.find({ name: { $regex: regex } })
      .skip(skipIndex)
      .limit(totalElements)
      .sort({ createdAt: -1 });
    res.json({ categories, totalPages, totalCategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoriesSummary = async (req, res) => {
  try {
    const [skipIndex, totalElements, totalPages, totalCategories] = await categoryPaginator(req, 12);
    const { searchTerm } = req.query;
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
  } catch (error) {
    res.status(500).send('Error al obtener el resumen de categorías');
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({
      name,
      description,
      image: req.file ? req.file.filename : null
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
