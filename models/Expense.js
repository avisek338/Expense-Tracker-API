const mongoose = require('mongoose')

ExpenseSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
    },
    price:{
        type:Number,
        required:[true,'Please provide price'],
    },
    spendAt:{
        type:Date,
        default:Date.now()
    },
    category:{
        type:String,
        require:[true,'Please provide category'],
        minlength:[1,'Please provide category'] ,
        enum:['groceries','leisure','electronics','utilities','clothing','health','others']
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide user']
    }


})

module.exports = mongoose.model('Expense',ExpenseSchema)