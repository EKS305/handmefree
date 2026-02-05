-- Items being given away
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT NOT NULL, -- active | closed | expired
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

-- People who showed interest
CREATE TABLE IF NOT EXISTS interests (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL,
  status TEXT NOT NULL, -- pending | active | closed
  created_at INTEGER NOT NULL,
  FOREIGN KEY (item_id) REFERENCES items(id)
);
