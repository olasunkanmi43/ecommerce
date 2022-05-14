const express = require('express');

const router = express.Router();

const {homeView, productView, productDetails, searchPost} = require('../controllers/uController');

router.get('/', homeView);
router.get('/products/:category', productView);
router.get('/details/:pid', productDetails);
router.post('/search', searchPost);


module.exports = router;