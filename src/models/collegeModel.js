const mongoose = require('mongoose') 
const url = require('mongoose-type-url');

const collegeSchema = new mongoose.Schema({
    name: { type: String, require: true, unique: true,lowercase:true, trim:true },

    fullName: { type: String, require: true,trim:true },

    logoLink: {type:url, required: true,trim:true},

    isDeleted:{
        type:Boolean,
        default:false
    }
}, {timestamps: true})

module.exports = mongoose.model('College', collegeSchema)