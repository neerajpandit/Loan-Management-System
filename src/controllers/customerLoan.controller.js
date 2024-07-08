import { CustomerLoan } from "../models/customerLoan.model.js";
import { Customer } from "../models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { EMIDetail } from "../models/emiDetails.model.js";
import mongoose from "mongoose";


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







export const issueLoan = asyncHandler(async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    const {customerId} = req.params;
    try {
        const { loanType, loanAmount, interest, tenure, firstEMIDate, latePaymentPenalty } = req.body;

        // Validate customer ID
        if (!mongoose.Types.ObjectId.isValid(customerId)) {
            throw new ApiError(400, "Invalid customer ID");
        }

        const customer = await Customer.findById(customerId);
        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        // Calculate loan amount after interest
        const loanAmountAfterInterest = loanAmount + (loanAmount * interest / 100);

        // Calculate monthly EMI
        const monthlyEMI = loanAmountAfterInterest / tenure;

        // Create loan
        const loan = new CustomerLoan({
            loanType,
            loanAmount,
            interest,
            loanAmountAfterInterest,
            tenure,
            monthlyEMI,
            firstEMIDate,
            latePaymentPenalty,
            customerId,
            customerID: customer.customerID
        });
        customer.loans.push(loan._id);
        await customer.save();
        await loan.validate();
        await loan.save({ session });

        // Create EMI details
        const emiDetails = [];
        let emiDate = new Date(firstEMIDate);
        for (let i = 0; i < tenure; i++) {
            const emiDetail = {
                loanId: loan._id,
                emiDate: new Date(emiDate),
                emiAmount: monthlyEMI,
                status: "Upcoming",
                submissionDate: null,
                penalty: "No",
                totalAmount: monthlyEMI
            };
            emiDetails.push(emiDetail);

            // Move to next month
            emiDate.setMonth(emiDate.getMonth() + 1);
        }

        await EMIDetail.insertMany(emiDetails, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(new ApiResponse(201, 'Loan issued and EMI details saved successfully'));

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error issuing loan:', error);
        throw new ApiError(500, 'An error occurred during loan issuance');
    }
});





export const getLoanDetails = asyncHandler(async (req, res) => {
    const { loanId } = req.params;

    // Validate loan ID
    if (!mongoose.Types.ObjectId.isValid(loanId)) {
        throw new ApiError(400, "Invalid loan ID");
    }

    // Fetch loan details using aggregation pipeline
    const loanDetails = await CustomerLoan.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(loanId) } },
        {
            $lookup: {
                from: "emidetails", // Ensure this matches your collection name in the database
                localField: "_id",
                foreignField: "loanId",
                as: "emiDetails"
            }
        },
        {
            $project: {
                _id: 1,
                loanID: 1,
                loanType: 1,
                loanAmount: 1,
                interest: 1,
                loanAmountAfterInterest: 1,
                tenure: 1,
                monthlyEMI: 1,
                firstEMIDate: 1,
                latePaymentPenalty: 1,
                isActive: 1,
                customerID: 1,
                emiDetails: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    if (!loanDetails.length) {
        throw new ApiError(404, "Loan not found");
    }

    // Respond with loan details
    res.status(200).json(new ApiResponse(200, 'Loan details retrieved successfully', loanDetails[0]));
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



// Controller function to update EMI status
export const updateEMIStatus = async (req, res) => {
    try {
        const { emiId, status, submissionDate } = req.body;

        // Find the EMI detail by ID
        const emiDetail = await EMIDetail.findById(emiId);

        if (!emiDetail) {
            return res.status(404).json({ message: 'EMI detail not found' });
        }

        // Update the status and submission date if the status is 'Paid'
        if (status === 'Paid') {
            emiDetail.status = 'Paid';
            emiDetail.submissionDate = submissionDate || new Date();
        } else {
            return res.status(400).json({ message: 'Invalid status update' });
        }

        // Save the updated EMI detail
        await emiDetail.save();

        res.status(200).json({ message: 'EMI status updated successfully', emiDetail });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while updating the EMI status', error });
    }
};




export { createCustomerLoan,updateLoanStatus };
