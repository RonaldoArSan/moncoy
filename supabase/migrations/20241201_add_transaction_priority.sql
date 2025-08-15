-- Add priority column to transactions table
ALTER TABLE transactions 
ADD COLUMN priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));