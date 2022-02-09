const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "name is required",
        trim: true
    },
    
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required' 
    },

    mobile: {
        type: String,
        trim: true,
        required : true,
        unique:true
    },

    collegeId: {
        type: ObjectId,
        ref: 'College'
    },

    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })
module.exports = mongoose.model('intern', internSchema)
