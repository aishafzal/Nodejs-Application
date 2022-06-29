const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/DB',{
useNewUrlParser:true,
useUnifiedTopology:true
})
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    name:'String',
    brand: 'String',
    price:'Number'
})

const Product = new mongoose.model('shoes',ProductSchema);
module.exports = Product