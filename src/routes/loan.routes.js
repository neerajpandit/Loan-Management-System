import { Router } from "express";

const router=Router();

import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createCustomerLoan, getLoanDetails, updateEMIStatus } from "../controllers/customerLoan.controller.js";
import { issueLoan } from "../controllers/customerLoan.controller.js";
router.route("/createLoan").post(createCustomerLoan);
router.route("/issueLoan/:customerId").post(issueLoan)
router.route("/:loanId").get(getLoanDetails)
router.route("/emiUpdate").put(updateEMIStatus)

export default router;