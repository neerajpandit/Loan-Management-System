import mongoose from "mongoose";
const { Schema } = mongoose;

const customerLoanSchema = new Schema({
    loanID: {
        type: String,
        required: true,
        unique: true,
    },
    loanType: {
        type: String,
        enum: ["Personal Loan", "Mortgages Loan", "Home Equity Loan", "Auto Loan"],
        required: true
    },
    loanAmount: {
        type: Number,
        required: true
    },
    interest: {
        type: Number,
        required: true
    },
    loanAmountAfterInterest: {
        type: Number,
        required: true
    },
    tenure: {
        type: Number,
        required: true
    },
    monthlyEMI: {
        type: Number,
        required: true
    },
    firstEMIDate: {
        type: Date,
        required: true
    },
    loanIssueDate: {
        type: Date,
        required: true
    },
    latePaymentPenalty: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true // Assuming loans are active when created
    },
    customerId: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    customerID: {
        type: String,
        required: true
    }
    
}, { timestamps: true });

// Pre-validate hook to generate unique loanID
customerLoanSchema.pre('validate', async function (next) {
    if (this.isNew) {
        let isUnique = false;
        while (!isUnique) {
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            this.loanID = `LN${randomNumber}`;

            const existingLoan = await mongoose.model('CustomerLoan').findOne({ loanID: this.loanID });
            if (!existingLoan) {
                isUnique = true;
            }
        }
    }
    next();
});

export const CustomerLoan = mongoose.model("CustomerLoan", customerLoanSchema);
