-- Crowe Logic AI - Authentication System Setup
-- This script sets up the complete user authentication and profile system

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired')),
    subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'enterprise')),
    trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}',
    usage_stats JSONB DEFAULT '{
        "chat_messages": 0,
        "images_generated": 0,
        "protocols_created": 0,
        "batches_tracked": 0
    }'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_status ON user_profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create chat_sessions table for storing user chat history
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Chat',
    model_used TEXT DEFAULT 'crowe-logic-ai',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    is_archived BOOLEAN DEFAULT FALSE
);

-- Create chat_messages table for storing individual messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    model_used TEXT,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for chat tables
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable RLS for chat tables
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for chat_sessions
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions" ON chat_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for chat_messages
CREATE POLICY "Users can view own chat messages" ON chat_messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages" ON chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create cultivation_protocols table for storing user protocols
CREATE TABLE IF NOT EXISTS cultivation_protocols (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    substrate_formula JSONB NOT NULL,
    environmental_parameters JSONB NOT NULL,
    sterilization_protocol JSONB NOT NULL,
    inoculation_method TEXT,
    expected_yield_range TEXT,
    contamination_risk_score INTEGER CHECK (contamination_risk_score >= 0 AND contamination_risk_score <= 100),
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    estimated_timeline TEXT,
    notes TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1
);

-- Create batch_tracking table for cultivation batches
CREATE TABLE IF NOT EXISTS batch_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    protocol_id UUID REFERENCES cultivation_protocols(id) ON DELETE SET NULL,
    batch_name TEXT NOT NULL,
    species TEXT NOT NULL,
    substrate_weight_kg DECIMAL(10,2),
    inoculation_date DATE,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    current_stage TEXT CHECK (current_stage IN ('preparation', 'sterilization', 'inoculation', 'colonization', 'fruiting', 'harvest', 'completed', 'contaminated')),
    environmental_data JSONB DEFAULT '{}',
    observations JSONB DEFAULT '[]',
    yield_actual_kg DECIMAL(10,2),
    contamination_notes TEXT,
    success_rating INTEGER CHECK (success_rating >= 1 AND success_rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for cultivation tables
CREATE INDEX IF NOT EXISTS idx_cultivation_protocols_user_id ON cultivation_protocols(user_id);
CREATE INDEX IF NOT EXISTS idx_cultivation_protocols_species ON cultivation_protocols(species);
CREATE INDEX IF NOT EXISTS idx_batch_tracking_user_id ON batch_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_batch_tracking_current_stage ON batch_tracking(current_stage);
CREATE INDEX IF NOT EXISTS idx_batch_tracking_inoculation_date ON batch_tracking(inoculation_date);

-- Enable RLS for cultivation tables
ALTER TABLE cultivation_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_tracking ENABLE ROW LEVEL SECURITY;

-- RLS policies for cultivation_protocols
CREATE POLICY "Users can view own protocols and public protocols" ON cultivation_protocols
    FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert own protocols" ON cultivation_protocols
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own protocols" ON cultivation_protocols
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own protocols" ON cultivation_protocols
    FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for batch_tracking
CREATE POLICY "Users can view own batches" ON batch_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own batches" ON batch_tracking
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own batches" ON batch_tracking
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own batches" ON batch_tracking
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update message count in chat sessions
CREATE OR REPLACE FUNCTION public.update_session_message_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE chat_sessions 
        SET message_count = message_count + 1, updated_at = NOW()
        WHERE id = NEW.session_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE chat_sessions 
        SET message_count = message_count - 1, updated_at = NOW()
        WHERE id = OLD.session_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for message count updates
DROP TRIGGER IF EXISTS update_message_count_on_insert ON chat_messages;
CREATE TRIGGER update_message_count_on_insert
    AFTER INSERT ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_session_message_count();

DROP TRIGGER IF EXISTS update_message_count_on_delete ON chat_messages;
CREATE TRIGGER update_message_count_on_delete
    AFTER DELETE ON chat_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_session_message_count();

-- Insert some sample data for testing (optional)
-- This will only run if there are no existing protocols
INSERT INTO cultivation_protocols (
    user_id, name, species, substrate_formula, environmental_parameters, 
    sterilization_protocol, inoculation_method, expected_yield_range,
    contamination_risk_score, difficulty_level, estimated_timeline, notes, is_public
)
SELECT 
    '00000000-0000-0000-0000-000000000000'::uuid,
    'Lion''s Mane Standard Protocol',
    'Hericium erinaceus',
    '{"hardwood_sawdust": 45, "soy_hulls": 45, "wheat_bran": 8, "calcium_carbonate": 2}'::jsonb,
    '{"temperature_range": "65-75°F", "humidity": "85-95%", "air_exchange": "2-4 times per hour", "light": "12 hours indirect"}'::jsonb,
    '{"method": "pressure_cooker", "temperature": "250°F", "pressure": "15 PSI", "duration": "90 minutes"}'::jsonb,
    'Liquid culture injection',
    '2.5-3.5 lbs per 10lb block',
    15,
    'intermediate',
    '4-6 weeks total',
    'Standard protocol for Lion''s Mane cultivation with excellent success rate',
    true
WHERE NOT EXISTS (SELECT 1 FROM cultivation_protocols LIMIT 1);

-- Create view for user dashboard statistics
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
    up.id as user_id,
    up.name,
    up.subscription_status,
    up.trial_ends_at,
    COALESCE(cs.total_sessions, 0) as total_chat_sessions,
    COALESCE(cm.total_messages, 0) as total_chat_messages,
    COALESCE(cp.total_protocols, 0) as total_protocols,
    COALESCE(bt.total_batches, 0) as total_batches,
    COALESCE(bt.active_batches, 0) as active_batches,
    up.created_at as member_since
FROM user_profiles up
LEFT JOIN (
    SELECT user_id, COUNT(*) as total_sessions
    FROM chat_sessions
    GROUP BY user_id
) cs ON up.id = cs.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as total_messages
    FROM chat_messages
    WHERE role = 'user'
    GROUP BY user_id
) cm ON up.id = cm.user_id
LEFT JOIN (
    SELECT user_id, COUNT(*) as total_protocols
    FROM cultivation_protocols
    GROUP BY user_id
) cp ON up.id = cp.user_id
LEFT JOIN (
    SELECT 
        user_id, 
        COUNT(*) as total_batches,
        COUNT(CASE WHEN current_stage NOT IN ('completed', 'contaminated') THEN 1 END) as active_batches
    FROM batch_tracking
    GROUP BY user_id
) bt ON up.id = bt.user_id;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Crowe Logic AI authentication system setup completed successfully!';
    RAISE NOTICE 'Tables created: user_profiles, chat_sessions, chat_messages, cultivation_protocols, batch_tracking';
    RAISE NOTICE 'RLS policies enabled for all tables';
    RAISE NOTICE 'Triggers and functions created for automatic profile management';
    RAISE NOTICE 'Sample data inserted for testing';
END $$;
