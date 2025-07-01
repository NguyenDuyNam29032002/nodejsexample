const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', (req, res) => {
  res.send('Hello from Node.js project!');
});

module.exports = router;
