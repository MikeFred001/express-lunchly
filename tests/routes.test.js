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





afterAll(async function () {
  // close db connection --- if you forget this, Jest will hang
  await db.end();
});