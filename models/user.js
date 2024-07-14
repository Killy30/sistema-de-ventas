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
    storeNumber: {type: Number},
    footText: {type: String},
    password: {type: String},
    system_control:{
        acceptITBIS: {type: Boolean, default: false},
        sale_with_ITBIS: {type: Boolean, default: false},
        add_N_C_receipt: {type: Boolean, default: false},
        typePrint: {type: String, default: 'ticket'}
    },
    prod_category: [{category: {type: String}}],
    products: [{ type: Schema.Types.ObjectId, ref: 'product'}],
    sales: [{ type: Schema.Types.ObjectId, ref: 'sale'}],
    cashiers: [{ type: Schema.Types.ObjectId, ref: 'cashier'}],
    clients: [{ type: Schema.Types.ObjectId, ref: 'client'}],
    checkouts: [{ type: Schema.Types.ObjectId, ref: 'checkout'}],
    plan: { type: Schema.Types.ObjectId, ref: 'plan'},
    date: {type: Date, default:Date.now}
})

UserSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9), null);
};

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
};

module.exports = model('User', UserSchema);
