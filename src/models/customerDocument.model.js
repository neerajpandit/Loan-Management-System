import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const customerDocumentsSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    // required: true
  },
  AadharCard: {
    number: { type: String },
    file: { type: String }
  },
  PANCard: {
    number: { type: String },
    file: { type: String}
  },
  VoterID: {
    number: { type: String },
    file: { type: String }
  },
  DrivingLicense: {
    number: { type: String },
    file: { type: String }
  },
  Passport: {
    number: { type: String },
    file: { type: String }
  },
  ITRNo: {
    number: { type: String},
    file: { type: String }
  }
}, { timestamps: true });

export const CustomerDocuments = mongoose.model('CustomerDocuments', customerDocumentsSchema);

