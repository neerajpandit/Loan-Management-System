import { Router } from "express";

const router=Router();

import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createCustomerLoan, getLoanDetails } from "../controllers/customerLoan.controller.js";
import { issueLoan } from "../controllers/customerLoan.controller.js";
router.route("/createLoan").post(createCustomerLoan);
router.route("/issueLoan").post(issueLoan)
router.route("/:loanId").get(getLoanDetails)

export default router;