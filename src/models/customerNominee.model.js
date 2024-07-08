import mongoose from "mongoose";
const { Schema } = mongoose;

const customerNomineeSchema = new Schema({
    fullName: {
        type: String,
        // required: [true, "Full name is required"],
        trim: true
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
        // required: [true, "Gender is required"]
    },
    dob: {
        type: Date,
        // required: [true, "Date of birth is required"]
    },
    relation: {
        type: String,
        // required: [true, "Relation is required"],
        trim: true
    },

    phoneNo: {
        type: String,
        // required: [true, "Phone number is required"],
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    email: {
        type: String,
        // required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
}, { timestamps: true });

export const CustomerNominee = mongoose.model("CustomerNominee", customerNomineeSchema);
