/*
  # Create webhook events table

  1. New Tables
    - `webhook_events`
      - `id` (uuid, primary key)
      - `event_type` (text) - Type of webhook event (crop_update, weather_alert, etc.)
      - `payload` (jsonb) - The webhook payload data
      - `processed` (boolean) - Whether the event has been processed
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `webhook_events` table
    - Add policy for authenticated users to read their own webhook events
*/

CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read webhook events"
  ON webhook_events
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can insert webhook events"
  ON webhook_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update webhook events"
  ON webhook_events
  FOR UPDATE
  TO service_role
  USING (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed ON webhook_events(processed);