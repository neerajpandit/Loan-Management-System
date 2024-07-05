import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Customer } from "../models/customer.model.js";
import { CustomerWitness } from "../models/customerWitness.model.js";
import { CustomerNominee } from "../models/customerNominee.model.js";
// Create a new customer
const createCustomer = asyncHandler(async (req, res) => {
    const {
        fullName,
        gender,
        dob,
        fatherName,
        motherName,
        maritalStatus,
        spouseName,
        phoneNo,
        email,
        currentAddress,
        permanentAddress
    } = req.body;

    // Validate marital status and spouse name
    if (maritalStatus === 'yes' && !spouseName) {
        throw new ApiError(400, "Spouse name is required if marital status is yes");
    }

    // Validate current address fields
    if (!currentAddress || !currentAddress.street || !currentAddress.locality || !currentAddress.state || !currentAddress.district || !currentAddress.pin) {
        throw new ApiError(400, "All current address fields are required");
    }

    // Validate permanent address fields
    if (!permanentAddress || !permanentAddress.street || !permanentAddress.locality || !permanentAddress.state || !permanentAddress.district || !permanentAddress.pin) {
        throw new ApiError(400, "All permanent address fields are required");
    }

    const customer = new Customer({
        fullName,
        gender,
        dob,
        fatherName,
        motherName,
        maritalStatus,
        spouseName,
        phoneNo,
        email,
        currentAddress: {
            street: currentAddress.street,
            locality: currentAddress.locality,
            state: currentAddress.state,
            district: currentAddress.district,
            pin: currentAddress.pin
        },
        permanentAddress: {
            street: permanentAddress.street,
            locality: permanentAddress.locality,
            state: permanentAddress.state,
            district: permanentAddress.district,
            pin: permanentAddress.pin
        }
        
    });

    await customer.save();

    res.status(201).json(new ApiResponse(201, "Customer created successfully", customer));
});

const getCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.find()
      .populate({ path: 'nominee', select: 'fullName gender dob relation phoneNo email' })
      .populate({ path: 'witness', select: 'fullName relation phoneNo email currentAddress' })
      .exec();
    
    res.status(201).json(new ApiResponse(201, "Customer Get Successfully",customers));

});


const createCustomerWitness = asyncHandler(async (req, res) => {
    const {
        fullName,
        relation,
        phoneNo,
        email,
        currentAddress,
        customerId // Assuming you pass customerId in the request body
    } = req.body;

    // Validate request body fields
    if (!fullName || !phoneNo || !relation || !email || !currentAddress || !customerId) {
        throw new ApiError(400, "All fields including customerId are required");
    }

    // Validate phone number format
    if (!phoneNo.match(/^\d{10}$/)) {
        throw new ApiError(400, "Please enter a valid 10-digit phone number");
    }

    // Validate email format
    if (!email.match(/^\S+@\S+\.\S+$/)) {
        throw new ApiError(400, "Please enter a valid email address");
    }

    // Check if Customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    // Create CustomerWitness document
    const customerWitness = new CustomerWitness({
        fullName,
        relation,
        phoneNo,
        email,
        currentAddress,
        customerId // Assign customerId to CustomerWitness
    });

    // Save CustomerWitness
    await customerWitness.save();

    // Update Customer with the new CustomerWitness reference
    customer.witness.push(customerWitness._id);
    await customer.save();

    // Respond with success message and created document
    res.status(201).json(new ApiResponse(201, "Customer witness created successfully", customerWitness));
});

const createCustomerNominee = asyncHandler(async (req, res) => {
    const {
        fullName,
        relation,
        gender,
        dob,
        phoneNo,
        email,
        customerId // Assuming you pass customerId in the request body
    } = req.body;

    // Validate request body fields
    if (!fullName || !relation || !phoneNo || !dob || !gender || !email || !customerId) {
        throw new ApiError(400, "All fields including customerId are required");
    }

    // Validate phone number format
    if (!phoneNo.match(/^\d{10}$/)) {
        throw new ApiError(400, "Please enter a valid 10-digit phone number");
    }

    // Validate email format
    if (!email.match(/^\S+@\S+\.\S+$/)) {
        throw new ApiError(400, "Please enter a valid email address");
    }

    // Check if Customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    // Create CustomerWitness document
    const customerNominee = new CustomerNominee({
        fullName,
        relation,
        phoneNo,
        dob,
        email,
        gender,
        customerId // Assign customerId to CustomerWitness
    });

    // Save CustomerWitness
    await customerNominee.save();

    // Update Customer with the new CustomerWitness reference
    customer.nominee.push(customerNominee._id);
    await customer.save();

    // Respond with success message and created document
    res.status(201).json(new ApiResponse(201, "Customer witness created successfully", customerNominee));
});

const updateNominee = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, gender, dob, phoneNo, email } = req.body;

    // Validate nominee fields
    if (!name || !gender || !dob || !phoneNo || !email) {
        throw new ApiError(400, "All nominee fields are required");
    }

    const customer = await Customer.findByIdAndUpdate(
        id,
        { nominee: { name, gender, dob, phoneNo, email } },
        { new: true, runValidators: true }
    );

    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    res.status(200).json(new ApiResponse(200, "Nominee updated successfully", customer));
});


// Update an existing customer
const updateCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.maritalStatus === 'yes' && !updateData.spouseName) {
        throw new ApiError(400, "Spouse name is required if marital status is yes");
    }

    const customer = await Customer.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    res.status(200).json(new ApiResponse(200, "Customer updated successfully", customer));
});

// Delete a customer
const deleteCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const customer = await Customer.findByIdAndDelete(id);

    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    res.status(200).json(new ApiResponse(200, "Customer deleted successfully"));
});

// Get a customer by ID
const getCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
        throw new ApiError(404, "Customer not found");
    }

    res.status(200).json(new ApiResponse(200, "Customer retrieved successfully", customer));
});

export { createCustomer,getCustomers,createCustomerWitness,createCustomerNominee, updateCustomer,updateNominee, deleteCustomer, getCustomer };
