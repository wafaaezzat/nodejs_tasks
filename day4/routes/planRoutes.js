const express = require('express');
const planController = require('./../controllers/planController');
const authController = require('../controllers/authController');

const router = express.Router();

// router.param('id', planController.checkID);

router
  .route('/top-5-cheap')
  .get(planController.aliasTopplans, planController.getAllplans);

router.route('/plan-stats').get(planController.getplanStats);
router.route('/monthly-plan/:year').get(planController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, planController.getAllplans)
  .post(planController.createplan);

router
  .route('/:id')
  .get(planController.getplan)
  .patch(planController.updateplan)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    planController.deleteplan
  );

module.exports = router;
