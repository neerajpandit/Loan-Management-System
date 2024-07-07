import mongoose from 'mongoose';
import { BankDetails } from '../models/bankDetails.model.js';

import { Customer } from '../models/customer.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Create bank details for a customer
export const createBankDetails = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { bankAccountNo, bankName, ifscCode, branchName, accountHolderName } = req.body;

  // Validate required fields
  if (!bankAccountNo || !bankName || !ifscCode || !branchName || !accountHolderName) {
    throw new ApiError(400, 'All fields are required for bank details');
  }

  // Check if customer exists
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  // Create bank details
  const newBankDetails = new BankDetails({
    customerId,
    bankAccountNo,
    bankName,
    ifscCode,
    branchName,
    accountHolderName
  });

  // Save bank details to the database
  await newBankDetails.save();

  const apiResponse = new ApiResponse({
    message: 'Bank details added successfully',
    data: newBankDetails
  });

  res.status(201).json(apiResponse);
});

// Get bank details for a customer
export const getBankDetails = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  // Check if customer exists
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  // Find bank details for the customer
  const bankDetails = await BankDetails.findOne({ customerId });

  if (!bankDetails) {
    throw new ApiError(404, 'Bank details not found');
  }

  const apiResponse = new ApiResponse({
    message: 'Bank details retrieved successfully',
    data: bankDetails
  });

  res.status(200).json(apiResponse);
});

// Update bank details for a customer
export const updateBankDetails = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const { bankAccountNo, bankName, ifscCode, branchName, accountHolderName } = req.body;

  // Validate required fields
  if (!bankAccountNo || !bankName || !ifscCode || !branchName || !accountHolderName) {
    throw new ApiError(400, 'All fields are required for bank details');
  }

  // Check if customer exists
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  // Find and update bank details
  let bankDetails = await BankDetails.findOne({ customerId });

  if (!bankDetails) {
    // Create new bank details if not found
    bankDetails = new BankDetails({
      customerId,
      bankAccountNo,
      bankName,
      ifscCode,
      branchName,
      accountHolderName
    });
  } else {
    // Update existing bank details
    bankDetails.bankAccountNo = bankAccountNo;
    bankDetails.bankName = bankName;
    bankDetails.ifscCode = ifscCode;
    bankDetails.branchName = branchName;
    bankDetails.accountHolderName = accountHolderName;
  }

  // Save updated bank details
  await bankDetails.save();

  const apiResponse = new ApiResponse({
    message: 'Bank details updated successfully',
    data: bankDetails
  });

  res.status(200).json(apiResponse);
});

// Delete bank details for a customer
export const deleteBankDetails = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  // Check if customer exists
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  // Find and delete bank details
  const bankDetails = await BankDetails.findOneAndDelete({ customerId });

  if (!bankDetails) {
    throw new ApiError(404, 'Bank details not found');
  }

  const apiResponse = new ApiResponse({
    message: 'Bank details deleted successfully',
    data: bankDetails
  });

  res.status(200).json(apiResponse);
});
