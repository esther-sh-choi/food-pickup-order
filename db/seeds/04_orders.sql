INSERT INTO
  orders (
    created_at,
    estimated_ready_at,
    ready_at,
    customer_id
  ) VALUES (
  NOW(),
  NOW(),
  NULL,
  1
),(
  NOW(),
  NULL,
  NULL,
  2
);
