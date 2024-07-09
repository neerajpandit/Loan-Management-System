import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CollateralDetailsSchema = new Schema({
  loanId: {
    type: Schema.Types.ObjectId,
    ref: 'CustomerLoan',
    required: true
  },
  collateral: {
    text: { type: String },
    file: { type: String}
  },


}, { timestamps: true });

export const CollateralDetails = mongoose.model('CollateralDetails', CollateralDetailsSchema);

