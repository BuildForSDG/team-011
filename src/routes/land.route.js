const express = require('express');
const multer = require('multer');
const createHttpError = require('http-errors');
const { celebrate, Segments } = require('celebrate');

// const fileUpload = require('express-fileupload');

const router = express.Router();

const roleMiddleware = require('../middlewares/role.middleware');
const Land = require('../controllers/land.controller');
const { UserRole } = require('../models/user.model');
const { landDtoSchema, landUpdateDtoSchema } = require('../validations/land.schema');

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
      cb(createHttpError(createHttpError.BadRequest(), 'Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

router.get('/', Land.getAllLand);
router.get('/:id', Land.getOneLand);

router.post(
  '/',
  upload.single('photo'),
  roleMiddleware(UserRole.Admin, UserRole.Landowner),
  celebrate({ [Segments.BODY]: landDtoSchema }),
  Land.createLand
);

// Only admin should be able to edit/delete ANY land
router.put(
  '/:id',
  upload.single('photo'),
  roleMiddleware(UserRole.Admin),
  celebrate({ [Segments.BODY]: landUpdateDtoSchema }),
  Land.modifyLandDetail
);
router.delete('/:id', roleMiddleware(UserRole.Admin), Land.deleteLandDetail);

module.exports = router;
