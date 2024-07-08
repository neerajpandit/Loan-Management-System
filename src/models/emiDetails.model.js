import mongoose from "mongoose";
const { Schema } = mongoose;

const emiDetailSchema = new Schema({
    loanId: {
        type: Schema.Types.ObjectId,
        ref: "CustomerLoan",
        // required: true
    },
    emiDate: {
        type: Date,
        // required: true
    },
    emiAmount: {
        type: Number,
        // required: true
    },
    status: {
        type: String,
        enum: ["Paid", "Upcoming"],
        // required: true
    },
    submissionDate: {
        type: Date
    },
    penalty: {
        type: String,
        enum: ["Yes", "No"],
        // required: true
    },
    totalAmount: {
        type: Number,
        // required: true
    }
}, { timestamps: true });

export const EMIDetail = mongoose.model("EMIDetail", emiDetailSchema);
