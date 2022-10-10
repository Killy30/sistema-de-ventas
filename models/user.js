const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    email: {type: String},
    storeName: {type: String},
    storeAddress: {type: String},
    password: {type: String},
    products: [{ type: Schema.Types.ObjectId, ref: 'product'}],
    sales: [{ type: Schema.Types.ObjectId, ref: 'sale'}],
    cashiers: [{ type: Schema.Types.ObjectId, ref: 'cashier'}]
})

UserSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
};

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
};

module.exports = model('User', UserSchema);
