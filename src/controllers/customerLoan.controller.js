import { CustomerLoan } from "../models/customerLoan.model.js";
import { Customer } from "../models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCustomerLoan = asyncHandler(async (req, res) => {
    const {
        loanType,
        interest,
        loanAmount,
        tenure,
        firstEMIDate,
        latePaymentPenalty,
        customerID // Assuming you pass customerID in the request body
    } = req.body;

    // Validate request body fields
    if (!loanType || !interest || !loanAmount || !tenure || !firstEMIDate || !latePaymentPenalty || !customerID) {
        throw new ApiError(400, "All fields including customerID are required");
    }

    // Check if Customer exists
    const customer = await Customer.findById(customerID);
    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    // Calculate loanAmountAfterInterest and monthlyEMI
    const loanAmountAfterInterest = loanAmount + (loanAmount * interest / 100);
    const monthlyEMI = loanAmountAfterInterest / tenure;


    // Create CustomerLoan document
    const customerLoan = new CustomerLoan({
        loanType,
        interest,
        loanAmount,
        loanAmountAfterInterest,
        tenure,
        monthlyEMI,
        firstEMIDate,
        latePaymentPenalty,
        customerId: customer._id,
        customerID: customer.customerID
        
    });

    // Save CustomerLoan
    await customerLoan.save();


       // Update Customer with the new CustomerWitness reference
       customer.loans.push(customerLoan._id);
       await customer.save();
    // Respond with success message and created document
    res.status(201).json(new ApiResponse(201, "Customer loan created successfully", customerLoan));
});


// Update Loan Status
const updateLoanStatus = asyncHandler(async (req, res) => {
    const { loanID } = req.params;
    const { isActive } = req.body; // Assuming you pass the status in the request body

    // Validate request body fields
    if (typeof isActive !== 'boolean') {
        throw new ApiError(400, "isActive field is required and should be a boolean");
    }

    // Find the loan by loanID
    const loan = await CustomerLoan.findOne({ loanID });
    if (!loan) {
        throw new ApiError(404, "Loan not found");
    }

    // Update the loan status
    loan.isActive = isActive;
    await loan.save();

    // Respond with success message and updated document
    res.status(200).json(new ApiResponse(200, "Loan status updated successfully", loan));
});




export { createCustomerLoan,updateLoanStatus };
