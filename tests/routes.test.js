"use strict";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

let testCustomer;

beforeEach(async function () {
  await db.query("DELETE FROM customers");
  let result = await db.query(`
    INSERT INTO customers (first_name, last_name, phone, notes)
    VALUES ('Mike', 'Fred', '555-555-5555', 'Test Notes')
    RETURNING id, first_name, last_name, phone, notes`);
  testCustomer = result.rows[0];
});

describe("GET /", function () {
  test("Gets customer list html", async function () {
    const resp = await request(app).get(`/`);
    expect(resp.text).toContain('For Testing Customer List');
  });
});

describe("GET /top-ten", function () {
  test("Gets top ten customers", async function () {
    const resp = await request(app).get(`/top-ten`);
    expect(resp.text).toContain('For Testing Top Ten');
  });

  test("Should contain expected customer", async function () {
    const resp = await request(app).get(`/top-ten`);
    expect(resp.text).toContain(testCustomer.first_name);
  });

});

describe("GET /add/", function () {
  test("Shows add customer form html", async function () {
    const resp = await request(app).get(`/add`);
    expect(resp.text).toContain('<h1>Add a Customer</h1>');
  });
});

// describe("POST /add/", function () {
//   test("Adds a new customer html", async function () {
//     const resp = await request(app).post(`/add/`).send(testCustomer);
//     expect(resp.statusCode).toEqual(301);
//     expect(resp.text).toContain('<h1>Test1_first_name Test_1_last_name</h1>');
//   });
// });


describe("GET /:id/", function () {
  test("Shows a certain customer html", async function () {
    const resp = await request(app).get(`/${testCustomer.id}`);
    expect(resp.text).toContain('<h1>Mike Fred</h1>');
  });
});

describe("GET /:id/edit", function () {
  test("edit a certain customer html", async function () {
    const resp = await request(app)
      .post(`/${testCustomer.id}/edit`)
      .send({
        firstName: 'Jack',
        lastName: 'Fred',
        phone: '555-555-5555',
        notes: 'Hi.'
      });
    console.log("RESPONSE TEXT>>>>>>>>>", resp.text);
    // expect(resp.statusCode).toEqual(301);
    expect(resp.text).toContain('<h1>Jack Fred</h1>');
  });
});








afterAll(async function () {
  // close db connection --- if you forget this, Jest will hang
  await db.end();
});