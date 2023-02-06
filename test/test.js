const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const db = require("../services/db");

const expect = chai.expect;

chai.use(chaiHttp);

describe("Transactions API", () => {
  // Insert test data
  before(async () => {
    await db.query("DELETE FROM transactions");
    await insertTestData();
  });

  // Test PUT endpoint
  describe("PUT /transactionservice/transaction/:transaction_id", () => {
    it("should add a new transaction", (done) => {
      chai
        .request(server)
        .put("/transactionservice/transaction/13")
        .send({
          amount: 100.0,
          type: "Income",
          parent_id: null,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body)
            .to.have.property("message")
            .eql("Transaction added succesfully");
          done();
        });
    });
  });

  // Test GET endpoint for a single transaction
  describe("GET /transactionservice/transaction/:transaction_id", () => {
    it("should retrieve a transaction by ID", (done) => {
      chai
        .request(server)
        .get("/transactionservice/transaction/1")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("amount").eql(500.0);
          expect(res.body).to.have.property("type").eql("UPI");
          done();
        });
    });

    it("should return an error if the transaction is not found", (done) => {
      chai
        .request(server)
        .get("/transactionservice/transaction/999")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.a("object");
          expect(res.body)
            .to.have.property("error")
            .eql("Transaction not found");
          done();
        });
    });
  });

  // Test GET endpoint for transactions sum
  describe("GET /transactionservice/sum/:id", () => {
    it("should return the sum of transactions linked to the transaction with the specified ID", (done) => {
      chai
        .request(server)
        .get("/transactionservice/sum/1")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("sum").eql(5000);
          done();
        });
    });
  });

  // Test GET endpoint for transactions by type
  describe("GET /transactionservice/types/:type", () => {
    it("should return the IDs of all transactions with the specified type", (done) => {
      chai
        .request(server)
        .get("/transactionservice/types/UPI")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.lengthOf(3);
          done();
        });
    });
  });

  async function insertTestData() {
    await db.query(`
      INSERT INTO transactions (id, amount, type, parent_id)
      VALUES
        (1, 500, 'UPI', null),
        (2, 1000, 'Card', 1),
        (3, 1500, 'UPI', 2),
        (4, 2000, 'UPI', 3),
        (5, 1600, 'Card', null)
    `);
  }
});
