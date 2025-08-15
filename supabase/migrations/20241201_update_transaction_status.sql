-- Update transaction status column to include new status values
ALTER TABLE transactions 
DROP CONSTRAINT IF EXISTS transactions_status_check;

ALTER TABLE transactions 
ADD CONSTRAINT transactions_status_check 
CHECK (status IN ('pending', 'completed', 'cancelled', 'overdue', 'due_soon'));

-- Update existing transactions with old status values if needed
UPDATE transactions 
SET status = 'completed' 
WHERE status NOT IN ('pending', 'completed', 'cancelled', 'overdue', 'due_soon');