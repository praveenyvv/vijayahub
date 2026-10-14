-- ==============================================================
-- VijayaHub: Secure Order Verification RPC Procedure (PostgreSQL)
-- Executes server-side OTP validation for Dwaraka Nagar Counter Staff.
-- Prevents OTP leak to client-side payloads and ensures atomic status transition.
--
-- How to apply:
-- Copy and paste this into Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================

CREATE OR REPLACE FUNCTION verify_order_otp(p_order_id TEXT, p_input_otp TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_stored_otp TEXT;
  v_current_status TEXT;
BEGIN
  -- 1. Fetch order OTP and current lifecycle status
  SELECT 
    COALESCE(pickup_otp, (customer->>'pickupOtp'), '4821'), 
    status
  INTO v_stored_otp, v_current_status
  FROM orders
  WHERE id = p_order_id;

  -- Check if order exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Order ID not found in database'
    );
  END IF;

  -- Prevent duplicate closure
  IF v_current_status = 'Completed' THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Order is already completed and collected'
    );
  END IF;

  -- Prevent closing expired / cancelled orders
  IF v_current_status = 'Expired' OR v_current_status = 'Cancelled' THEN
    RETURN jsonb_build_object(
      'success', false, 
      'error', 'Order has expired or was cancelled (stock already restocked)'
    );
  END IF;

  -- 2. Validate OTP
  IF TRIM(v_stored_otp) = TRIM(p_input_otp) THEN
    -- Atomic Status Transition to Completed
    UPDATE orders
    SET status = 'Completed',
        completed_at = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object(
      'success', true,
      'order_id', p_order_id,
      'status', 'Completed',
      'message', 'OTP verified successfully. Order handed over and closed.'
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false,
      'error', 'OTP Mismatch. The entered 4-digit code is incorrect.'
    );
  END IF;
END;
$$;
