const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const {Schema, model} = require('mongoose')

const UserSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    email: {type: String},
    storeName: {type: String},
    typeStore: {type: String},
    storeAddress: {type: String},
    footText: {type: String},
    password: {type: String},
    planPro: {type: Boolean, default: false},
    system_control:{
        acceptITBIS: {type: Boolean, default: false},
        add_N_C_receipt: {type: Boolean, default: false},
        typePrint: {type: String, default: 'ticket'}
    },
    products: [{ type: Schema.Types.ObjectId, ref: 'product'}],
    sales: [{ type: Schema.Types.ObjectId, ref: 'sale'}],
    cashiers: [{ type: Schema.Types.ObjectId, ref: 'cashier'}],
    clients: [{ type: Schema.Types.ObjectId, ref: 'client'}]
})

UserSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
};

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
};

module.exports = model('User', UserSchema);
