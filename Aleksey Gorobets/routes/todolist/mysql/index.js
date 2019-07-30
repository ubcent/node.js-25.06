const express = require('express');
const root = require('./root');

const router = express.Router();

router.use("/", root);

module.exports = router;
