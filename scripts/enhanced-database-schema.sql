-- Enhanced database schema for user-specific data storage

-- Extend user profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS 
  lab_name VARCHAR(255),
  organization VARCHAR(255),
  timezone VARCHAR(50) DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}';

-- Create user documents table
CREATE TABLE IF NOT EXISTS user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  content TEXT,
  file_size BIGINT DEFAULT 0,
  file_path VARCHAR(500),
  status VARCHAR(50) DEFAULT 'ready',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user environmental data table
CREATE TABLE IF NOT EXISTS user_environmental_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  location VARCHAR(255) NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  co2_level INTEGER,
  ph_level DECIMAL(4,2),
  pressure DECIMAL(8,2),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user batches table
CREATE TABLE IF NOT EXISTS user_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  batch_number VARCHAR(100) NOT NULL,
  strain_name VARCHAR(255) NOT NULL,
  substrate_type VARCHAR(255) NOT NULL,
  inoculation_date DATE,
  expected_harvest DATE,
  actual_harvest DATE,
  yield_amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user protocols table
CREATE TABLE IF NOT EXISTS user_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,
  steps JSONB DEFAULT '[]',
  parameters JSONB DEFAULT '{}',
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user alerts table
CREATE TABLE IF NOT EXISTS user_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  priority VARCHAR(20) DEFAULT 'medium',
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user tools usage table
CREATE TABLE IF NOT EXISTS user_tools_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  tool_name VARCHAR(255) NOT NULL,
  action VARCHAR(255) NOT NULL,
  parameters JSONB DEFAULT '{}',
  result JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_category ON user_documents(category);
CREATE INDEX IF NOT EXISTS idx_user_environmental_data_user_id ON user_environmental_data(user_id);
CREATE INDEX IF NOT EXISTS idx_user_environmental_data_recorded_at ON user_environmental_data(recorded_at);
CREATE INDEX IF NOT EXISTS idx_user_batches_user_id ON user_batches(user_id);
CREATE INDEX IF NOT EXISTS idx_user_batches_status ON user_batches(status);
CREATE INDEX IF NOT EXISTS idx_user_protocols_user_id ON user_protocols(user_id);
CREATE INDEX IF NOT EXISTS idx_user_alerts_user_id ON user_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_alerts_is_read ON user_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_user_tools_usage_user_id ON user_tools_usage(user_id);

-- Row Level Security (RLS) policies
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_environmental_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tools_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Users can only access their own data
CREATE POLICY "Users can only access their own documents" ON user_documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own environmental data" ON user_environmental_data
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own batches" ON user_batches
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own protocols" ON user_protocols
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own alerts" ON user_alerts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own tools usage" ON user_tools_usage
  FOR ALL USING (auth.uid() = user_id);
