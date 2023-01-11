"use strict";

const shipItApi = require("../shipItApi") // <-- must be at very top
shipItApi.shipProduct = jest.fn(); // <-- must be at very top

const request = require("supertest");
const app = require("../app");

const jsonschema = require("jsonschema");
const orderSchema = require("../schemas/orderSchema.json");


describe("POST /", function () {
  /* test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: expect.any(Number) });
  }); */

  test("throws error if empty request body", async function () {
    const resp = await request(app).post("/shipments").send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if input is not valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 999,
      name: "kaddem",
      addr: "123 Main Street",
      zip: "93012",
    });
    expect(resp.statusCode).toEqual(400);
  });
});


describe("POST /shipments", function () {
  test("valid", async function () {

    shipItApi.shipProduct.mockReturnValue(1234);

    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "kaddem",
      addr: "123 Main Street",
      zip: "93012",
    });
    expect(resp.body).toEqual({shipped: 1234})
    // TODO: CHECK ERROR MESSAGES ARE COMING BACK CORRECTLY USING ".stack"
  });
});
