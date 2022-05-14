const express = require('express');

const router = express.Router();

const {mSignup, mLogin, mReg, mLoginPost, home, addProduct, addProductPost, viewProduct, editPage, editPagePost, deletePage, logout} = require('../controllers/mController');

router.get('/signup', mSignup);
router.get('/login', mLogin);
router.post('/signup', mReg);
router.post('/login', mLoginPost);
router.get('/dashboard', home);
router.get('/addPro', addProduct);
router.post('/addPro', addProductPost);
router.get('/viewPro', viewProduct);
router.get('/edit/:pid', editPage);
router.post('/edit/:pid', editPagePost);
router.get('/delete/:pid', deletePage);
router.get('/logout', logout);

module.exports = router;