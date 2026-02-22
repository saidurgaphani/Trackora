const express = require('express');
const router = express.Router();
const { generateRoadmap, chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/roadmap', protect, generateRoadmap);
router.post('/chat', protect, chatWithAI);

module.exports = router;
