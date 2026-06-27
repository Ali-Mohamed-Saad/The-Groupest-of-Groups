const express = require('express');
const authMiddleware = require('../middleware/auth.js');
const { sendMessage } = require("../src/controllers/aiController.js");

const router = express.Router();

router.post('/', authMiddleware, sendMessage);

module.exports = router;