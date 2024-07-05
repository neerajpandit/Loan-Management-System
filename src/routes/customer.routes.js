import { Router } from "express";

const router=Router();

import {verifyJWT} from "../middlewares/auth.middleware.js"
import { createCustomer, createCustomerWitness, createCustomerNominee, getCustomers } from "../controllers/customer.controller.js";

router.route("/createCustomer").post(createCustomer);
router.route("/getCustomer").get(getCustomers)
router.route("/addNominee").post(createCustomerNominee);
router.route("/createCustomerWitness").post(createCustomerWitness)

export default router;