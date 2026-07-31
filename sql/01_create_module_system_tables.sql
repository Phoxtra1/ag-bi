-- Component Registry Table
CREATE TABLE IF NOT EXISTS component_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  icon TEXT DEFAULT 'zap',
  endpoint TEXT NOT NULL,
  input_format JSONB,
  output_format JSONB,
  api_type TEXT CHECK (api_type IN ('internal', 'external')) DEFAULT 'internal',
  external_api_url TEXT,
  external_api_key TEXT,
  enabled BOOLEAN DEFAULT true,
  permissions TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Health Tracking Table
CREATE TABLE IF NOT EXISTS api_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_name TEXT UNIQUE NOT NULL REFERENCES component_registry(name) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'delayed', 'offline')) DEFAULT 'offline',
  response_time_ms INTEGER,
  last_check TIMESTAMPTZ DEFAULT NOW(),
  error_message TEXT,
  endpoint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Health Metrics Table
CREATE TABLE IF NOT EXISTS system_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  total_modules INTEGER NOT NULL,
  active_modules INTEGER NOT NULL,
  offline_modules INTEGER NOT NULL,
  avg_response_time_ms NUMERIC,
  health_score NUMERIC CHECK (health_score >= 0 AND health_score <= 100),
  details JSONB
);

-- Interaction Logs Table
CREATE TABLE IF NOT EXISTS interaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  request_type TEXT NOT NULL,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  processing_time_ms INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_component_registry_enabled ON component_registry(enabled);
CREATE INDEX IF NOT EXISTS idx_component_registry_category ON component_registry(category);
CREATE INDEX IF NOT EXISTS idx_api_health_status ON api_health(status);
CREATE INDEX IF NOT EXISTS idx_api_health_module ON api_health(module_name);
CREATE INDEX IF NOT EXISTS idx_system_health_timestamp ON system_health(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_interaction_logs_user ON interaction_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_interaction_logs_module ON interaction_logs(module_name);
CREATE INDEX IF NOT EXISTS idx_interaction_logs_timestamp ON interaction_logs(timestamp DESC);

-- Enable RLS
ALTER TABLE component_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE interaction_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for component_registry
CREATE POLICY "Anyone can view enabled components"
  ON component_registry FOR SELECT
  USING (enabled = true);

CREATE POLICY "Admins can manage components"
  ON component_registry FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- RLS Policies for api_health
CREATE POLICY "Admins can view api health"
  ON api_health FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "System can update api health"
  ON api_health FOR ALL
  USING (true);

-- RLS Policies for system_health
CREATE POLICY "Admins can view system health"
  ON system_health FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "System can insert system health"
  ON system_health FOR INSERT
  WITH CHECK (true);

-- RLS Policies for interaction_logs
CREATE POLICY "Users can view their own logs"
  ON interaction_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all logs"
  ON interaction_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "System can insert logs"
  ON interaction_logs FOR INSERT
  WITH CHECK (true);

-- Insert default components
INSERT INTO component_registry (name, display_name, description, category, icon, endpoint, api_type, display_order, permissions) VALUES
  ('dipa_chatbot', 'Dipa', 'AI-powered chatbot assistant', 'AI', 'message-square', 'amniva-verify', 'internal', 1, '{}'),
  ('prediction', 'Prediction Engine', 'AI predictions for trends and forecasts', 'Analytics', 'brain', 'amniva-prediction-engine', 'internal', 2, '{}'),
  ('verify', 'Verify Engine', 'Content authenticity verification', 'Security', 'shield', 'amniva-verify-engine', 'internal', 3, '{}'),
  ('report', 'Report Engine', 'Attribution and analytics reports', 'Analytics', 'file-text', 'amniva-report-engine', 'internal', 4, '{}'),
  ('trending', 'Trending Engine', 'Real-time trend detection', 'Analytics', 'trending-up', 'amniva-trending-engine', 'internal', 5, '{}')
ON CONFLICT (name) DO NOTHING;
