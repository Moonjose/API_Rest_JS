import multer from 'multer';
import multerConfig from '../config/multerConfig';
import Photo from '../models/Photo';

const upload = multer(multerConfig).single('filepic');

class PhotoController {
  store(req, res) {
    return upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          errors: [err.code],
        });
      }
      const { originalname, filename } = req.file;
      const { aluno_id } = req.body;
      const photo = await Photo.create({ originalname, filename, aluno_id });
      return res.json(photo);
    });
  }
}

export default new PhotoController();