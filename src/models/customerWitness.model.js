import mongoose from "mongoose";
const { Schema } = mongoose;

const addressSchema = new Schema({
    street: {
        type: String,
        // required: true,
        trim: true
    },
    locality: {
        type: String,
        // required: true,
        trim: true
    },
    state: {
        type: String,
        // required: true,
        trim: true
    },
    district: {
        type: String,
        // required: true,
        trim: true
    },
    pin: {
        type: String,
        // required: true,
        match: [/^\d{6}$/, "Please enter a valid 6-digit PIN code"]
    }
}, { _id: false });

const customerWitnessSchema = new Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true
    },

    relation: {
        type: String,
        required: [true, "Relation is required"],
        trim: true
    },

    phoneNo: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    currentAddress: {
        type: addressSchema,
        required: [true, "Current address is required"]
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    }
}, { timestamps: true });

export const CustomerWitness = mongoose.model("CustomerWitness", customerWitnessSchema);
