const bcrypt = require('bcryptjs'),
      Merchant = require('../model/merchant'),
      Product = require('../model/product'),
      mongoose = require('mongoose'),
      fs = require('fs'),
      multer = require('multer'),
      path = require('path');
const product = require('../model/product');
   
    //   let storage = multer.diskStorage({
    //       destination: (req, file, cb) => {
    //           cb(null, 'uploads')
    //       },
    //       filename: (req, file, cb) => {
    //           cb(null, file.fieldname + '-'+ Date.now())
    //       }
    //   });

    //   let upload = multer({storage: storage});

//DISPLAY SIGNUP PAGE
const mSignup = (req, res) => {
    res.render('signup');

}

//DISPLAY LOGIN PAGE
const mLogin = (req, res) => {
    res.render('login');
}

//DISPLAY MERCHANT SIGNUP / REGISTRATION FORM
const mReg = (req, res) => {
    // console.log(req.body);
    // res.send("We are processing your information")

    const {fn, ln, phone, cacStatus, username, pass1, pass2} = req.body;

    let error = [];

    if(!fn || !ln || !phone || !cacStatus || !username || !pass1 || !pass2) {
        error.push({msg: "Some fields are missing. Please fill them up"});
        res.render("signup", {error, fn, ln, phone, cacStatus, username, pass1, pass2});
    }

    if(pass1 !== pass2) {
        error.push({msg: "Passwords do not match"});
        res.render("signup", {error, fn, ln, phone, cacStatus, username, pass1, pass2});
    }

    if(error.length < 1) {

        // res.send("We are getting somewhere");
        bcrypt.hash(pass1, 10, (error, hash) => {
            const merchant = new Merchant({
                fn,
                ln,
                phone,
                cacStatus,
                username,
                password:hash,
                // image: {
                //     data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                //     contentType: 'image/png'
                // }
            });
            merchant.save((err) => {
                if(err) {
                    // res.send("There was a problem saving");
                    // console.log(err);

                    req.flash('error_msg', "There was a problem saving into the database");
                    res.redirect('/signup');
                } else {
                    // res.send("Your data has been successfully captured");
                    req.flash('message', "Data successful captured. Now you can login");
                    res.redirect('/login');
                }
            })
        })
    }
}

const mLoginPost = (req, res) => {
    // console.log(req.body);
    // res.send("Processing");

    const {username, password} = req.body;

    Merchant.findOne({username:username}, (error, result) => {
        if(error) {
            console.log(error);
            res.send("Trying to resolve an issue");
            
        }

        if(!result) {
            req.flash('error_msg', "Username does not exist");
            res.redirect('/login');
        } else {
            
            bcrypt.compare(password, result.password, (err, isVerified) => {

                if(err) {
                    req.flash('error_msg', "Something uncommon has happened.");
                    res.redirect('/login');
                }  if(isVerified) {
                    req.session.merchant_id = result._id;
                    req.session.username = result.username;

                    res.redirect('/dashboard');
                } else {
                    req.flash('error_msg', "Incorrect Password");
                    res.redirect('/login');
                }
            })
        }

        // if(result) {
        //     res.send("There's result");
        //     console.log(result);
        // } else {
        //     res.send("There's no result");
        // }
    })
}

const home = (req, res) => {

   if(!req.session.merchant_id && !req.session.username) {
       req.flash('error_msg', "Please login to access App");
       res.redirect('/login');
   } else {
       res.render('dashboard', {merchant_id:req.session.merchant_id, username:req.session.username});
   }
}

const addProduct = (req, res) => {

    if(!req.session.merchant_id && !req.session.username) {
        req.flash('error_msg', "Please login to access App");
        res.redirect('/login');
    } else {
        res.render('add_product', {merchant_id:req.session.merchant_id, username:req.session.username});
    }
 }

 const addProductPost = (req, res) => {

    if(!req.session.merchant_id && !req.session.username) {
        req.flash('error_msg', "Please login to access App");
        res.redirect('/login');
    } else {
        // console.log(req.body);
        // res.send("Processing");

        const{ productName, description, price, category} = req.body;

        let error = [];

        if(!productName || !description || !price || !category) {
            error.push["Vital Fields are missing. Please fill them up"];
            res.render("add_product", {error, productName, description, price, category});
        }

        if(error.length < 1) {

            const product = new Product({
                productName, description, price, category, username: req.session.username
            });

            product.save((err) => {
                if(err) {
                    req.flash('error_msg', "Could not saved into the Database");
                    res.redirect('/addPro');
                } else {
                    req.flash('message', "Product successfully saved into DB");
                    res.redirect('/addPro');
                }
            })
        }

    }
    
 }

 const viewProduct = (req, res) => {
     if(!req.session.merchant_id && !req.session.username) {
         req.flash('error_msg', "Please login to access App");
         res.redirect('/login');
     } else {
        Product.find({username:req.session.username}, (error, result) => {
            if(error) {
                req.flash('error_msg', "Could not select from the Database");
                res.redirect('/viewPro');
            } else {
                res.render('viewPro', {result, username:req.session.username});
                
            }
        })
     }
 }

 const editPage = (req, res) => {

    if(!req.session.merchant_id && !req.session.username) {
        req.flash('error_msg', "Please login to access App");
        res.redirect('/login');
    } else {
       Product.find({_id:req.params.pid}, (error, result) => {
           if(error) {
               req.flash('error_msg', "Could not query Database");
               res.redirect('/edit/:pid');
           } else {
               res.render('edit_page', {result, username:req.session.username});
               
           }
       })
    }
 }

 const editPagePost = (req, res) => {

    const {productName, description, price} = req.body;

    Product.updateOne({_id:req.params.pid}, {$set:{productName, description, price}}, (err, result) => {
        if(error) {
            req.flash('error_msg', "Could not update product");
            res.redirect('/edit/:pid');
        } else {
            req.flash('message', "Product successfully updated");
            res.redirect('/viewPro');
            
        }
    })
 }

 const deletePage = (req, res) => {

    if(!req.session.merchant_id && !req.session.username) {
        req.flash('error_msg', "Please login to access App");
        res.redirect('/login');
    } else {
       Product.deleteOne({_id:req.params.pid}, (error, result) => {
           if(error) {
               req.flash('error_msg', "Could not query Database");
               res.redirect('/viewPro');
           } else {
            req.flash('message', "Product successfully deleted"); 
               res.redirect('/viewPro');
               
           }
       })
    }
 }

 const logout = (req, res) => {
     res.redirect('/login');
 }



module.exports = {
    mSignup,
    mLogin,
    mReg,
    mLoginPost,
    home,
    addProduct,
    addProductPost,
    viewProduct,
    editPage,
    editPagePost,
    deletePage, 
    logout
}