var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    audioIDs: {type: Array, default: []}
});

// generates hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, 8);
};

// compares the password
userSchema.methods.validateHash = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', userSchema);
