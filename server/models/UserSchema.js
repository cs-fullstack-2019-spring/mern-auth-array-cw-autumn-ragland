let mongoose = require('mongoose');
let Schema = mongoose.Schema;
//user schema with book array
let UserSchema = new Schema(
    {
        username: {type: String, required: true, max: 100},
        password: {type: String, required: true, max: 100},
        books: [{type: String}],
    }
);

//Export model
module.exports = mongoose.model('User10', UserSchema);