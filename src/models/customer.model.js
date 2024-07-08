import mongoose from "mongoose";
const { Schema } = mongoose;
import { CustomerWitness } from "./customerWitness.model.js";
import { EmploymentStatusSchema } from "./employmentStatus.model.js";
const addressSchema = new Schema({
    street: {
        type: String,
        required: true,
        trim: true
    },
    locality: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    pin: {
        type: String,
        required: true,
        match: [/^\d{6}$/, "Please enter a valid 6-digit PIN code"]
    }
}, { _id: false });


const customerSchema = new Schema({
    fullName: {
        type: String,
        // required: [true, "Full name is required"],
        trim: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Others"],
        // required: [true, "Gender is required"]
    },
    dob: {
        type: Date,
        // required: [true, "Date of birth is required"]
    },
    fatherName: {
        type: String,
        // required: [true, "Father's name is required"],
        trim: true
    },
    motherName: {
        type: String,
        // required: [true, "Mother's name is required"],
        trim: true
    },
    maritalStatus: {
        type: String,
        enum: ["yes", "no"],
        // required: [true, "Marital status is required"]
    },
    spouseName: {
        type: String,
        required: function () {
            return this.maritalStatus === "yes";
        },
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
    currentAddress: {
        type: addressSchema,
        // required: [true, "Current address is required"]
    },
    permanentAddress: {
        type: addressSchema,
        // required: [true, "Permanent address is required"]
    },
    avatar:{
        type: String
    },
    nominee: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CustomerNominee",
      },
    ],
    witness: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CustomerWitness",
        },
      ],
    loans: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CustomerLoan",
        }
    ],
    customerID: {
        type: String,
        unique: true,
        required: true
    },
    employmentStatus: EmploymentStatusSchema
}, { timestamps: true });

customerSchema.pre('validate', async function (next) {
    if (this.isNew) {
        let isUnique = false;
        while (!isUnique) {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            this.customerID = `LMS${randomNumber}`;

            const existingCustomer = await Customer.findOne({ customerID: this.customerID });
            if (!existingCustomer) {
                isUnique = true;
            }
        }
    }
    next();
});

export const Customer = mongoose.model("Customer", customerSchema);
