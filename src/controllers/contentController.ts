import { Request, Response } from 'express';
import { Content, ContentDocument } from '../models/Content';
import { QueryFilter, QueryRequest, UserRequest } from '../@types';

const contentPaginator = async (req: Request) => {
  let skipIndex: number = 0;
  let totalElements: number = 9;
  let totalPages: number = 0;
  let totalContents: number = 0;
  try {
    const { page = 1, limit = 9 }: QueryRequest = req.query;
    skipIndex = (page - 1) * limit;
    totalContents = await Content.countDocuments();
    totalPages = Math.ceil(totalContents / limit);
    totalElements = limit;
  } catch (err) {
  }
  return [skipIndex, totalElements, totalPages, totalContents]
}

exports.getContent = async (req: Request, res: Response) => {
  try {
    const [skipIndex, totalElements, totalPages, totalContents] = await contentPaginator(req);
    const filter: QueryFilter = {};
    const { searchTerm = '', category = ''}: QueryRequest = req.query;
    if (searchTerm) {
      filter.title = { $regex: new RegExp(searchTerm, 'i') };
    }
    if (category) {
      filter.category = category;
    }
    const contents = await Content.find(filter)
      .populate('category')
      .skip(skipIndex)
      .limit(totalElements)
      .sort({ createdAt: -1 });
    res.json({ contents, totalPages, totalContents });
  } catch (err) {
    if (err instanceof Error)
      res.status(500).json({ message: err.message });
  }
};

exports.getContentById = async (req: Request, res: Response) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Contenido no encontrado' });
    res.json(content);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};

exports.getContentByCategoryId = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const { searchTerm = '' } = req.query;

    const contents = await Content.find({
      category: categoryId,
      $and: [
        { title: { $regex: searchTerm, $options: 'i' } }
      ],
    })
      .populate('category', 'name')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.send(contents);
  } catch (err) {
    res.status(500).send('Error al obtener los contenidos por categoría');
  }
};

exports.createContent = async (req: UserRequest, res: Response) => {
  try {
    const content: ContentDocument = new Content(req.body);
    content.createdBy = req.user.id;
    await content.save();
    res.status(201).json(content);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};

exports.updateContent = async (req: UserRequest, res: Response) => {
  try {
    let content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Contenido no encontrado' });
    if (content.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este contenido' });
    }
    content = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(content);
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};

exports.deleteContent = async (req: UserRequest, res: Response) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Contenido no encontrado' });
    if (content.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este contenido' });
    }
    await Content.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contenido eliminado' });
  } catch (err) {
    if (err instanceof Error)
      res.status(400).json({ message: err.message });
  }
};
