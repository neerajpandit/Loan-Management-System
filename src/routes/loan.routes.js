import { Router } from "express";
const router=Router();

import { calculateEMI, getLoanDetails, updateEMIStatus } from "../controllers/customerLoan.controller.js";
import { issueLoan } from "../controllers/customerLoan.controller.js";


router.route("/:loanId").get(getLoanDetails)
router.route("/emiUpdate").put(updateEMIStatus)

//calculateEMI', 
router.route("/calculateEMI/:customerId").post(calculateEMI)
//issueLoan
router.route("/issueLoan/:customerId").post(issueLoan)


export default router;