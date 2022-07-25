const mongoose = require('mongoose');
const pLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});
UserSchema.plugin(pLocalMongoose);
module.exports= mongoose.model('User', UserSchema);