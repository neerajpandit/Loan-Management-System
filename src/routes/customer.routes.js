import { Router } from "express";

const router=Router();

import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createCustomer, createCustomerWitness, createCustomerNominee, getCustomers, registerCustomer, registerCustomer1, registerCustomer2 } from "../controllers/customer.controller.js";
import { createEmploymentStatus } from "../controllers/employMentStatus.controller.js";
import { createBankDetails } from "../controllers/bankDetails.controller.js";
import { getAllCustomersWithLoanDetails, getCustomerDetails } from "../controllers/customerProfile.controller.js";
import { createCustomerDocuments } from "../controllers/customerDocument.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

router.route("/register").post(registerCustomer)

//avatar with
router.route("/registerfile").post( upload.single('avatar'), registerCustomer2);

router.route("/createCustomer").post(createCustomer);
router.route("/getCustomer").get(getCustomers)
router.route("/addNominee").post(createCustomerNominee);
router.route("/createCustomerWitness").post(createCustomerWitness)

router.route("/:customerId/createEmployStatus").put(createEmploymentStatus)

router.route("/:customerId/bankDetails").post(createBankDetails)

// router.route("/:customerId/details").get(getCustomerDetails)

router.route("/customerProfiles").get(getAllCustomersWithLoanDetails)

router.route("/:customerId/document").post(createCustomerDocuments)

router.route("/:customerId").get(getCustomerDetails)


router.route("/register1").post(upload.fields([
    { name: 'AadharCard', maxCount: 1 },
    { name: 'PANCard', maxCount: 1 },
    { name: 'VoterID', maxCount: 1 },
    { name: 'DrivingLicense', maxCount: 1 },
    { name: 'Passport', maxCount: 1 },
    { name: 'ITRNo', maxCount: 1 }
]), registerCustomer1);

export default router;