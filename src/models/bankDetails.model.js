// models/bankDetails.model.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BankDetailsSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    // required: true
  },
  bankAccountNo: {
    type: String,
    // required: true
  },
  bankName: {
    type: String,
    // required: true
  },
  ifscCode: {
    type: String,
    // required: true
  },
  branchName: {
    type: String,
    // required: true
  },
  accountHolderName: {
    type: String,
    // required: true
  }
});

export const BankDetails = mongoose.model('BankDetails', BankDetailsSchema);


