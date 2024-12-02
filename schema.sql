DROP TABLE IF EXISTS Customers;
CREATE TABLE Customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP(3) NULL,
  CompanyName TEXT NOT NULL,
  ContactName TEXT NOT NULL
);

INSERT INTO Customers (CompanyName, ContactName) VALUES ('Alfreds Futterkiste', 'Maria Anders');
INSERT INTO Customers (CompanyName, ContactName) VALUES ('Around the Horn', 'Thomas Hardy');
INSERT INTO Customers (CompanyName, ContactName) VALUES ('Bs Beverages', 'Victoria Ashworth');

--- todo8
CREATE TABLE todo8 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK(status IN ('pending', 'completed')) DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
--- todo9
CREATE TABLE IF NOT EXISTS todo9 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  public BOOLEAN NOT NULL DEFAULT false,
  foodOrange BOOLEAN NOT NULL DEFAULT false,
  foodApple BOOLEAN NOT NULL DEFAULT false,
  foodBanana BOOLEAN NOT NULL DEFAULT false,
  pubDate TEXT NOT NULL,
  qty1 TEXT NOT NULL,
  qty2 TEXT NOT NULL,
  qty3 TEXT NOT NULL,
  createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--todo10
DROP TABLE IF EXISTS todo10;
CREATE TABLE IF NOT EXISTS todo10 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  content_type TEXT,
  age TEXT,
  public BOOLEAN DEFAULT false,
  food_orange BOOLEAN DEFAULT false,
  food_apple BOOLEAN DEFAULT false,
  food_banana BOOLEAN DEFAULT false,
  food_melon BOOLEAN DEFAULT false,
  food_grape BOOLEAN DEFAULT false,
  date_publish TEXT NULL DEFAULT NULL,
  date_update TEXT NULL DEFAULT NULL,
  post_number TEXT NULL DEFAULT NULL,
  address_country TEXT NULL DEFAULT NULL,
  address_pref TEXT NULL DEFAULT NULL,
  address_city TEXT NULL DEFAULT NULL,
  address_1 TEXT NULL DEFAULT NULL,
  address_2 TEXT NULL DEFAULT NULL,
  address_3 TEXT NULL DEFAULT NULL,
  text_option1 TEXT NULL DEFAULT NULL,
  text_option2 TEXT NULL DEFAULT NULL,
  text_option3 TEXT NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



