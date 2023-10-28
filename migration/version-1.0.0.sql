CREATE TABLE IF NOT EXISTS "booking" (
    "booking_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid (),
    "customer_id" INT NOT NULL,
    "driver_id" INT DEFAULT NULL,
    "call_center_id" INT DEFAULT NULL,
    "pickup_address_id" INT NOT NULL,
    "destination_address_id" INT NOT NULL,
    "num_passengers" INT DEFAULT 1,
    "voucher_code" VARCHAR DEFAULT NULL,
    "coupon_code" VARCHAR DEFAULT NULL,
    "trip_distance" FLOAT DEFAULT NULL,
    "trip_fare" DECIMAL(12,4) DEFAULT NULL,
    "discount_amount" DECIMAL(12,4) DEFAULT NULL,
    "total_amount" DECIMAL(12,4) DEFAULT NULL,
    "pickup_time" TIMESTAMP DEFAULT NULL,
    "dropoff_time" TIMESTAMP DEFAULT NULL,
    "scheduled_time" TIMESTAMP DEFAULT NULL,
    "cancel_time" TIMESTAMP DEFAULT NULL,
    "trip_vehicle_type" VARCHAR DEFAULT NULL,
    "payment_info_id" VARCHAR DEFAULT NULL,
    "booking_type" SMALLINT NOT NULL, -- OFFHAND = 1; SCHEDULED = 2;
    "booking_status" SMALLINT NOT NULL, -- CREATING = 1; CREATED = 2; CREATE_ERROR = 3; PROCESSING = 4; CONFIRM_ARRIVAL = 5; CONFIRM_ARRIVAL_ERROR = 6; DRIVER_IN_COMMING = 7; DRIVER_CANCELED = 8; DRIVER_PICKUP = 9; DRIVER_DROPOFF = 10; CANCELED = 11; COMPLETE = 12;
    "payment_method" SMALLINT NOT NULL, -- CASH_ON_HAND = 1; BANK_ACCOUNT = 2; BANK_CARD = 3; ZALOPAY_WALLET = 4; MOMO_WALLET = 5;
    "booking_source" SMALLINT NOT NULL, -- CUSTOMER = 1; CALL_CENTER = 2;
    "trip_rating" SMALLINT DEFAULT NULL,
    "trip_comment" VARCHAR DEFAULT NULL,
    "tip_amount" DECIMAL(12, 4) DEFAULT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FK_BOOKING_CUSTOMER_ID" FOREIGN KEY ("customer_id") REFERENCES "customer" ("customer_id"),
    CONSTRAINT "FK_BOOKING_DRIVER_ID" FOREIGN KEY ("driver_id") REFERENCES "driver" ("driver_id"),
    CONSTRAINT "FK_BOOKING_CALL_CENTER_ID" FOREIGN KEY ("call_center_id") REFERENCES "admin_user" ("admin_user_id"),
    CONSTRAINT "FK_BOOKING_PICKUP_ADDRESS_ID" FOREIGN KEY ("pickup_address_id") REFERENCES "address" ("address_id"),
    CONSTRAINT "FK_BOOKING_DESTINATION_ADDRESS_ID" FOREIGN KEY ("destination_address_id") REFERENCES "address" ("address_id"),
    CONSTRAINT "BOOKING_UUID_UNIQUE" UNIQUE ("uuid"),
    CONSTRAINT "BOOKING_POSITIVE_TRIP_FARE" CHECK(trip_fare >= 0),
    CONSTRAINT "BOOKING_POSITIVE_DISCOUNT_AMOUNT" CHECK(discount_amount >= 0),
    CONSTRAINT "BOOKING_POSITIVE_TOTAL_AMOUNT" CHECK(total_amount >= 0),
    CONSTRAINT "BOOKING_POSITIVE_TIP_AMOUNT" CHECK(tip_amount >= 0),
    CONSTRAINT "BOOKING_POSITIVE_TRIP_RATING" CHECK(trip_rating >= 0 AND trip_rating <= 5)
);

CREATE TABLE IF NOT EXISTS "address" (
    "address_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid (),
    "gg_place_id" VARCHAR DEFAULT NULL,
    "latitude" FLOAT NOT NULL,
    "longitude" FLOAT NOT NULL,
    "formatted" VARCHAR NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ADDRESS_UUID_UNIQUE" UNIQUE ("uuid")
);

CREATE TABLE IF NOT EXISTS "customer" (
    "customer_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    "full_name" VARCHAR DEFAULT NULL,
    "phone" VARCHAR NOT NULL,
    "email" VARCHAR DEFAULT NULL,
    "password" VARCHAR DEFAULT NULL,
    "verified" BOOLEAN DEFAULT FALSE,
    "avatar" VARCHAR DEFAULT NULL,
    "dob" DATE DEFAULT NULL,
    "account_status" SMALLINT NOT NULL DEFAULT 2, -- ACTIVE = 1; INACTIVE = 2;
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CUSTOMER_PHONE_UNIQUE" UNIQUE ("phone"),
    CONSTRAINT "CUSTOMER_EMAIL_UNIQUE" UNIQUE ("email"),
    CREATE INDEX "CUSTOMER_PHONE" ON "customer" ("phone")
);

CREATE TABLE IF NOT EXISTS "driver" (
    "driver_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    "full_name" VARCHAR DEFAULT NULL,
    "phone" VARCHAR NOT NULL,
    "email" VARCHAR DEFAULT NULL,
    "password" VARCHAR DEFAULT NULL,
    "avatar" VARCHAR DEFAULT NULL,
    "dob" DATE DEFAULT NULL,
    "address" VARCHAR NULL,
    "license_plate" VARCHAR DEFAULT NULL,
    "vehicle_type" VARCHAR DEFAULT NULL,
    "account_status" SMALLINT NOT NULL DEFAULT 2, -- ACTIVE = 1; INACTIVE = 2;
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DRIVER_PHONE_UNIQUE" UNIQUE ("phone"),
    CONSTRAINT "DRIVER_EMAIL_UNIQUE" UNIQUE ("email"),
    CREATE INDEX "DRIVER_PHONE" ON "driver" ("phone")
);

CREATE TABLE IF NOT EXISTS "admin_user" (
    "admin_user_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    "full_name" VARCHAR DEFAULT NULL,
    "phone" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "account_status" SMALLINT NOT NULL DEFAULT 2,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ADMIN_USER_EMAIL_UNIQUE" UNIQUE ("email"),
    CREATE INDEX "ADMIN_PHONE" ON "admin_user" ("phone")
);

CREATE TABLE IF NOT EXISTS "promotion" (
    "promotion_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
    "uuid" UUID NOT NULL DEFAULT gen_random_uuid (),
    "promotion_status" BOOLEAN NOT NULL DEFAULT TRUE,
    "description" VARCHAR NOT NULL,
    "discount_amount" DECIMAL(12, 4) NOT NULL,
    "discount_type" SMALLINT NOT NULL, -- PERCENTAGE = 1; DIRECT_DISCOUNT = 2;
    "promotion_type"  SMALLINT NOT NULL, -- VOUCHER = 1; COUPON = 2;
    "promotion_code" VARCHAR NOT NULL,
    "used_time" INT NOT NULL DEFAULT 0,
    "condition" TEXT NULL DEFAULT NULL,
    "user_condition" TEXT DEFAULT NULL,
    "max_uses_time_per_promotion" INT DEFAULT NULL,
    "max_uses_time_per_customer" INT DEFAULT NULL,
    "start_date" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    "end_date" TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PROMOTION_POSITIVE_DISCOUNT_AMOUNT" CHECK(discount_amount >= 0),
    CONSTRAINT "PROMOTION_VALID_PERCENTAGE_DISCOUNT" CHECK(discount_amount <= 100 OR discount_type = 1),
    CONSTRAINT "PROMOTION_UUID_UNIQUE" UNIQUE ("uuid"),
    CONSTRAINT "PROMOTION_UNIQUE" UNIQUE ("promotion_code")
);