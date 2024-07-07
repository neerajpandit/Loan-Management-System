import { Customer } from '../models/customer.model.js';
import { CustomerLoan } from '../models/customerLoan.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';



// Get all customers with loan details
export const getAllCustomersWithLoanDetails = asyncHandler(async (req, res) => {
  // Fetch all customers
  const customers = await Customer.find({});

  // Prepare array to hold formatted customer data
  let customersWithLoanDetails = [];

  // Loop through each customer and fetch loan statistics
  for (let customer of customers) {
    const customerId = customer._id;

    // Fetch loan statistics for the customer
    const totalLoans = await CustomerLoan.countDocuments({ customerId });
    const activeLoans = await CustomerLoan.countDocuments({ customerId, isActive: true });
    const completedLoans = await CustomerLoan.countDocuments({ customerId, isActive: false });

    // Determine loan status based on active loans count
    let loanStatus = 'No loans';
    if (activeLoans > 0) {
      loanStatus = 'Active';
    } else if (completedLoans > 0) {
      loanStatus = 'Completed';
    }

    // Prepare formatted customer data with loan details
    const customerWithLoanDetails = {
      name: customer.fullName,
      customerId: customer.customerID,
      gender: customer.gender,
      dob: customer.dob,
      fathersName: customer.fatherName,
      registrationDate: customer.createdAt, // Assuming registration date is createdAt
      loanStatistics: {
        totalLoans,
        activeLoans,
        completedLoans,
        loanStatus
      }
    };

    customersWithLoanDetails.push(customerWithLoanDetails);
  }

  const apiResponse = new ApiResponse({
    message: 'All customers with loan details retrieved successfully',
    data: customersWithLoanDetails
  });

  res.status(200).json(apiResponse);
});

// Get customer details with loan statistics
export const getCustomerDetails = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  // Fetch customer details
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  // Fetch loan statistics
  const totalLoans = await CustomerLoan.countDocuments({ customerId });
  const activeLoans = await CustomerLoan.countDocuments({ customerId, isActive: true });
  const completedLoans = await CustomerLoan.countDocuments({ customerId, isActive: false });

  // Determine loan status based on active loans count
  let loanStatus = 'No loans';
  if (activeLoans > 0) {
    loanStatus = 'Active';
  } else if (completedLoans > 0) {
    loanStatus = 'Completed';
  }

  const responseData = {
    name: customer.fullName,
    customerId: customer.customerID,
    gender: customer.gender,
    dob: customer.dob,
    fathersName: customer.fatherName,
    registrationDate: customer.createdAt, // Assuming registration date is createdAt
    loanStatistics: {
      totalLoans,
      activeLoans,
      completedLoans
    },
    loanStatus
  };

  const apiResponse = new ApiResponse({
    message: 'Customer details with loan statistics retrieved successfully',
    data: responseData
  });

  res.status(200).json(apiResponse);
});
