
import { Customer } from '../models/customer.model.js'; // Assuming you import Customer model
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {CustomerDocuments} from '../models/customerDocument.model.js';
// Example controller to create customer documents
export const createCustomerDocuments = asyncHandler(async (req, res) => {
  const { customerId } = req.params; // Assuming customerId is passed in the request params
  const { AadharCard, PANCard, VoterID, DrivingLicense, Passport, ITRNo } = req.body;

  // Check if customer exists
  const customer = await Customer.findById(customerId);
  if (!customer) {
    throw new Error('Customer not found');
  }

  // Create CustomerDocuments object
  const customerDocuments = new CustomerDocuments({
    customer: customerId,
    AadharCard,
    PANCard,
    VoterID,
    DrivingLicense,
    Passport,
    ITRNo
  });

  // Save customer documents
  await customerDocuments.save();

  const apiResponse = new ApiResponse({
    message: 'Customer documents saved successfully',
    data: customerDocuments
  });

  res.status(200).json(apiResponse);
});
