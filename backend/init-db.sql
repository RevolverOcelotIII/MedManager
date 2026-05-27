SELECT 'CREATE DATABASE test_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'test_db')\gexec
