"use strict";

const express = require("express");
const { BadRequestError } = require("../expressError");
const router = new express.Router();

const jsonschema = require("jsonschema");
const orderSchema = require("../schemas/orderSchema.json");


const { shipProduct } = require("../shipItApi");

/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
  if (req.body === undefined) throw new BadRequestError();

  const shipment = req.body; // "shipment" is obect that contains properties.

  const result = jsonschema.validate(
    shipment, orderSchema, {required:true} )

  if (!result.valid) {
    const errs = result.errors.map(error => error.stack);
    throw new BadRequestError(errs)
  }

  const { productId, name, addr, zip } = req.body;
  const shipId = await shipProduct({ productId, name, addr, zip });
  return res.json({ shipped: shipId });
});


module.exports = router;