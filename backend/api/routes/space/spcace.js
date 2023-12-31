const router = require('express').Router();
const { verifyAccessToken } = require("../../middlewares/auth");

const validate = require('../../middlewares/validator');
const space = require('../../controllers/space/spaces')

const validatorSchema = require("../../validators/space/space")

router.route('/').post(verifyAccessToken, validate(validatorSchema.spaceUser), space.create)
router.route('/').get(verifyAccessToken, space.getList);
// router.route('/:id').put(vlidatorSchema.spaceUpdateUser),space.update);
// router.route('/:id').delete(vererifyAccessToken, validate(vaifyAccessToken, space.deleteOne);
// router.route('/hardDelete/:id').delete(verifyAccessToken, space.deleteOneHard);

module.exports = router;