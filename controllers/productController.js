
const Product = require('../models/Product');
const product = async (req,res) =>
{
console.log("ID IS",req.session.id);
const product =await Product.find();
console.log(product);
if (req.session.user && req.cookies.user_sid) {
res.render('product',{product}); 
} else {
      res.redirect("/login");
    }
}
const create = function(req,res)
{
    if (req.session.user && req.cookies.user_sid) {
    res.render('create');}
    else {
        res.redirect("/login");
      }
    
}

const creates = (req,res) =>
{
 Product.create(req.body,function(req,res){
     console.log(res);
 });
} 
const edit = async (req,res) => 
{
const product =await Product.find();
console.log(product);
res.render('editproduct',{product});
}
const update = async (req,res) => {
    const pid = req.params.pid;
    console.log(pid);
    const prod = await Product.updateMany({_id:pid},{$set:{name:req.body.name,price:req.body.price}})
    console.log(prod);
    res.redirect('/create');
}
const deleted = async (req,res) => {
    const pid = req.params.pid;
    console.log(pid);
    const products = await Product.findByIdAndDelete(pid);
    const product = await Product.find();
    res.render('product',{product});

}

module.exports = {product,create,creates,edit,update,deleted};