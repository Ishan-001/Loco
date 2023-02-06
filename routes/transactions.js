const express = require("express");
const router = express.Router();
const service = require("../services/transactions");

router.get("/transaction/:id", async function (req, res, next) {
  try {
    const result = await service.getTransaction(req.params.id);
    if (!result) {
      res.status(404).json({ error: "Transaction not found" });
    } else {
      res.json(result);
    }
  } catch (err) {
    console.error(`Error while getting transaction: `, err.message);
    next(err);
  }
});

router.put("/transaction/:id", async function (req, res, next) {
  try {
    var message = await service.addTransaction(req.params.id, req.body);
    res.json({ message: message });
  } catch (err) {
    console.error(`Error while adding transaction: `, err.message);
    next(err);
  }
});

router.get("/types/:type", async function (req, res, next) {
  try {
    res.json(await service.getTransactionsByType(req.params.type));
  } catch (err) {
    console.error(`Error in fetching transactions: `, err.message);
    next(err);
  }
});

router.get("/sum/:id", async function (req, res, next) {
  try {
    const result = await service.getTransactionSum(req.params.id);
    res.json(result[0]);
  } catch (err) {
    console.error(`Error in getting transaction sum: `, err.message);
    next(err);
  }
});

module.exports = router;
