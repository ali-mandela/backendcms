-- This script was generated by the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public.bank
(
    bank_id integer NOT NULL DEFAULT nextval('bank_bank_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    sort_code character varying(6) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT bank_pkey PRIMARY KEY (bank_id)
);

CREATE TABLE IF NOT EXISTS public.customer
(
    customer_id integer NOT NULL DEFAULT nextval('customer_customer_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    telephone character varying(255) COLLATE pg_catalog."default" NOT NULL,
    date_of_birth date NOT NULL,
    bank_id integer,
    account_number character varying(8) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT customer_pkey PRIMARY KEY (customer_id)
);

CREATE TABLE IF NOT EXISTS public.product
(
    product_id integer NOT NULL DEFAULT nextval('product_product_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    cost numeric(10, 2) NOT NULL,
    type character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT product_pkey PRIMARY KEY (product_id)
);

CREATE TABLE IF NOT EXISTS public.store
(
    store_id integer NOT NULL DEFAULT nextval('store_store_id_seq'::regclass),
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    address character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT store_pkey PRIMARY KEY (store_id)
);

CREATE TABLE IF NOT EXISTS public.transaction
(
    transaction_id integer NOT NULL DEFAULT nextval('transaction_transaction_id_seq'::regclass),
    customer_id integer,
    product_id integer,
    total_cost numeric(10, 2) NOT NULL,
    store_id integer,
    rating integer,
    review text COLLATE pg_catalog."default",
    shipping_address character varying(255) COLLATE pg_catalog."default",
    transaction_date date,
    CONSTRAINT transaction_pkey PRIMARY KEY (transaction_id)
);

CREATE TABLE IF NOT EXISTS public.warehouse
(
    warehouse_id integer NOT NULL DEFAULT nextval('warehouse_warehouse_id_seq'::regclass),
    store_id integer,
    product_id integer,
    stock integer NOT NULL,
    CONSTRAINT warehouse_pkey PRIMARY KEY (warehouse_id)
);

ALTER TABLE IF EXISTS public.customer
    ADD CONSTRAINT customer_bank_id_fkey FOREIGN KEY (bank_id)
    REFERENCES public.bank (bank_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.transaction
    ADD CONSTRAINT transaction_customer_id_fkey FOREIGN KEY (customer_id)
    REFERENCES public.customer (customer_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.transaction
    ADD CONSTRAINT transaction_product_id_fkey FOREIGN KEY (product_id)
    REFERENCES public.product (product_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.transaction
    ADD CONSTRAINT transaction_store_id_fkey FOREIGN KEY (store_id)
    REFERENCES public.store (store_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.warehouse
    ADD CONSTRAINT warehouse_product_id_fkey FOREIGN KEY (product_id)
    REFERENCES public.product (product_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.warehouse
    ADD CONSTRAINT warehouse_store_id_fkey FOREIGN KEY (store_id)
    REFERENCES public.store (store_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

END;