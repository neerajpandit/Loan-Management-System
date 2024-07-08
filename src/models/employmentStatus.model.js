import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Define the EmploymentStatusSchema
export const EmploymentStatusSchema = new Schema({
  type: {
    type: String,
    enum: ['Salary', 'Government', 'Private', 'Business'],
    // required: true
  },
  organizationName: {
    type: String,
    // required: true
  },
  jobTitle: {
    type: String,
    // required: true
  },
  designation: {
    type: String,
    // required: true
  },
  joiningDate: {
    type: Date,
    // required: true
  },
  currentOrLastAnnualSalary: {
    type: Number,
    // required: true
  }
});


