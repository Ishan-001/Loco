const db = require("./db");

async function addTransaction(id, transaction) {
  const result = await db.query(
    `
        INSERT INTO transactions (id, amount, type, parent_id)
        VALUES (
            ${id},
            ${transaction.amount},
            '${transaction.type}',
            ${transaction.parent_id}
        )
        ON DUPLICATE KEY UPDATE
            amount =  VALUES(amount),
            type = VALUES(type),
            parent_id = VALUES(parent_id)

    `
  );

  return result.affectedRows
    ? "Transaction added succesfully"
    : "Transaction couldn't be added";
}

async function getTransaction(id) {
  const result = await db.query(
    `
        SELECT type, amount, parent_id
        FROM transactions
        WHERE id = ${id}    
    `
  );

  return result[0];
}

async function getTransactionsByType(type) {
  const result = await db.query(
    `
        SELECT id 
        FROM transactions
        WHERE type = "${type}"
    `
  );

  return result.map(function (it) {
    return it.id;
  });
}

// recursive query to get total sum of all linked child transactions

/*  time complexity for this query will be O(2^n) where n is the 
    maximum number of levels of parent - child relationships between the transactions */

/*  another approach can be maintaining a sum column in the table which updates 
    if an inserted transaction is a transitive child of one existing transaction */

async function getTransactionSum(id) {
  const result = db.query(
    `
        WITH RECURSIVE linked_transactions (id, parent_id, amount) AS (
            SELECT id, parent_id, amount
            FROM transactions
            WHERE id = ${id}
            UNION ALL
            SELECT t.id, t.parent_id, t.amount
            FROM transactions t
            JOIN linked_transactions lt ON t.parent_id = lt.id
        )
        SELECT SUM(amount) AS sum
        FROM linked_transactions;       
    `
  );

  return result;
}

module.exports = {
  getTransactionsByType,
  getTransaction,
  addTransaction,
  getTransactionSum,
};
