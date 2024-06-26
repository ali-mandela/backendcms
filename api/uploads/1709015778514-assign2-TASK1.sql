-- cmd to ceate a database named MME
CREATE DATABASE MME;

-- Drop existing tables (if they exist)
DROP TABLE IF EXISTS bank;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS transaction;
DROP TABLE IF EXISTS warehouse;



-- to show the tables present
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';

-- Create tables
CREATE TABLE bank (
  bank_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  sort_code VARCHAR(6) NOT NULL
);

CREATE TABLE customer (
  customer_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  telephone VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  bank_id INTEGER REFERENCES bank(bank_id),
  account_number VARCHAR(8) NOT NULL
);

CREATE TABLE store (
  store_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL
);

CREATE TABLE product (
  product_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  cost NUMERIC(10,2) NOT NULL,
  type VARCHAR(255) NOT NULL
);

CREATE TABLE transaction (
  transaction_id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customer(customer_id),
  product_id INTEGER REFERENCES product(product_id),
  total_cost NUMERIC(10,2) NOT NULL,
  store_id INTEGER REFERENCES store(store_id),
  rating INTEGER,
  review TEXT,
  transaction_date DATE;
  shipping_address VARCHAR(255)
);

CREATE TABLE warehouse (
  warehouse_id SERIAL PRIMARY KEY,
  store_id INTEGER REFERENCES store(store_id),
  product_id INTEGER REFERENCES product(product_id),
  stock INTEGER NOT NULL
);

-- Populating tables with data
INSERT INTO bank (name, address, sort_code)
VALUES
  ('America Bank', '123 Main Street', '12-34'),
  ('Bank of India', '456 New Delhi', '76-54');

INSERT INTO customer (name, address, telephone, date_of_birth, bank_id, account_number)
VALUES
  ('Micheal Doe', '123 Main Street', '123-456-7890', '1980-01-01', 1, '78901234'),
  ('Alex Doe', '456 Elm Street', '098-765-4321', '1981-02-02', 2, '56789012');

INSERT INTO store (name, address)
VALUES
  ('London Store', '123 Main Street'),
  ('New York Store', '456 Elm Street');

INSERT INTO product (name, description, cost, type)
VALUES
  ('Fender Stratocaster', 'A classic electric guitar with a versatile sound.', 1000.00, 'Guitar'),
  ('Pearl Export Series', 'A complete drum kit for beginners and intermediate players.', 500.00, 'Drum kit'),
  ('Yamaha PSR-E373', 'A portable keyboard with a wide range of features.', 300.00, 'Keyboard');

INSERT INTO transaction (customer_id, product_id, total_cost, store_id)
VALUES
  (1, 1, 1000.00, 1),
  (2, 2, 500.00, 2);

-- Adding product reviews for customer id = 1
UPDATE transaction
SET rating = 5,
review = 'This is a great guitar! I love the sound and it' WHERE customer_id=1

--  PL/pgSQL Stored Procedure to Register New Customers
CREATE OR REPLACE PROCEDURE register_new_customer(
  IN name VARCHAR(255),
  IN address VARCHAR(255),
  IN telephone VARCHAR(255),
  IN date_of_birth DATE,
  IN bank_id INTEGER,
  IN account_number VARCHAR(8)
)
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO customer (name, address, telephone, date_of_birth, bank_id, account_number)
  VALUES ($1, $2, $3, $4, $5, $6);
END; $$;

-- PL/pgSQL Stored Procedure to Allow Existing Customers to Purchase a Product:

CREATE OR REPLACE PROCEDURE purchase_product(
  IN customer_id INTEGER,
  IN product_id INTEGER,
  IN delivery_date DATE,
  IN delivery_time TIME
)
LANGUAGE plpgsql AS $$
DECLARE
  product_stock INTEGER;
  delivery_slot_available BOOLEAN;
BEGIN
  -- Check if the product is in stock.
  SELECT stock INTO product_stock FROM warehouse WHERE product_id = $2;
  IF product_stock <= 0 THEN
    RAISE EXCEPTION 'Insufficient stock for product %', $2;
  END IF;

  -- Check if the delivery slot is available.
  SELECT COUNT(*) INTO delivery_slot_available FROM transaction
  WHERE delivery_date = $3 AND delivery_time = $4;
  IF delivery_slot_available > 0 THEN
    RAISE EXCEPTION 'Delivery slot not available for %', $3 :: TEXT || ' at ' || $4 :: TEXT;
  END IF;

  -- Insert a new transaction record.
  INSERT INTO transaction (customer_id, product_id, quantity, total_cost, store_id, delivery_date, delivery_time)
  VALUES ($1, $2, 1, product_stock, 1, $3, $4);

  -- Update the product stock.
  UPDATE warehouse SET stock = stock - 1 WHERE product_id = $2;
END; $$;
-- Associated Code:
--A PL/pgSQL function to validate dates.
--A PL/pgSQL function to validate products.
--A PL/pgSQL function to check if a delivery slot is available. 

--Trigger to Validate Mandatory Fields:
CREATE TRIGGER validate_mandatory_fields
BEFORE INSERT OR UPDATE ON customer
FOR EACH ROW
EXECUTE PROCEDURE validate_mandatory_fields();

-- PL/pgSQL Function to Validate Mandatory Fields:

CREATE OR REPLACE FUNCTION validate_mandatory_fields()
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.name IS NULL THEN
    RAISE EXCEPTION 'Customer name is required.';
  END IF;

  IF NEW.address IS NULL THEN
    RAISE EXCEPTION 'Customer address is required.';
  END IF;

  IF NEW.telephone IS NULL THEN
    RAISE EXCEPTION 'Customer telephone number is required.';
  END IF;

  IF NEW.date_of_birth IS NULL THEN
    RAISE EXCEPTION 'Customer date of birth is required.';
  END IF;

  IF NEW.bank_id IS NULL THEN
    RAISE EXCEPTION 'Customer bank ID is required.';
  END IF;

  IF NEW.account_number IS NULL THEN
    RAISE EXCEPTION 'Customer account number is required.';
  END IF;
END; $$;
