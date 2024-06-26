const mongoose = require('mongoose');


const replySchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
       type:"string",
       required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const discussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: { 
            type:"string",
            required:true
          
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    replies: [replySchema] 
});

const Discussion = mongoose.model('Discussion', discussionSchema);

module.exports = Discussion;
