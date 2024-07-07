import mongoose from 'mongoose';
import { Customer } from '../models/customer.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create employment status for a customer
export const createEmploymentStatus = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  console.log(customerId)
  const { type, organizationName, jobTitle, designation, joiningDate, currentOrLastAnnualSalary } = req.body;

  // Validate required fields
  if (!type || !organizationName || !jobTitle || !designation || !joiningDate || !currentOrLastAnnualSalary) {
    throw new ApiError(400, 'All fields are required');
  }

  // Find the customer by ID
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  // Update or create employment status
  customer.employmentStatus = {
    type,
    organizationName,
    jobTitle,
    designation,
    joiningDate,
    currentOrLastAnnualSalary
  };

  // Save the updated customer document
  await customer.save();

  const apiResponse = new ApiResponse({
    message: 'Employment status added/updated successfully',
    data: customer
  });

  res.status(200).json(apiResponse);
});
