# Loco Assignment

This is a simple RESTful API made using Node.js, Express and MySQL that allows you to store transactions and retrieve information about those transactions. The transactions can be linked to each other using a parent id and you can retrieve the total amount involved for all transactions linked to a particular transaction.

## Installation

1. Clone the repository
2. Navigate to the project directory
3. Run `npm install` to install all dependencies
4. Create a new MySQL database
5. Replace the database credentials in config/database.js with your own
6. Run the following SQL commands to create the transactions table:

```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount DOUBLE NOT NULL,
    type VARCHAR(255) NOT NULL,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES transactions(id)
);

```

## Usage

Run `npm start` to start the server

## Testing

To run the tests, run `npm test` in the terminal. The tests were written using Mocha and Chai.
