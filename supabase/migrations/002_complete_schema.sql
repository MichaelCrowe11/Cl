-- ===================================
-- Crowe Logic AI - Complete Database Schema
-- Version: 2.1
-- ===================================

-- ===================================
-- ML Jobs Table
-- ===================================

CREATE TABLE IF NOT EXISTS public.ml_jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  service TEXT NOT NULL CHECK (service IN ('yield-prediction', 'substrate-calculation', 'contamination-analysis', 'vision-analysis')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  parameters JSONB NOT NULL,
  result JSONB,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  

);

-- ===================================
-- File Uploads Table
-- ===================================

CREATE TABLE IF NOT EXISTS public.file_uploads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  upload_type TEXT NOT NULL CHECK (upload_type IN ('vision', 'document', 'data', 'other')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  

);

-- ===================================
-- Workspace Files Table
-- ===================================

CREATE TABLE IF NOT EXISTS public.workspace_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  project_id UUID,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content TEXT,
  language TEXT,
  is_directory BOOLEAN DEFAULT FALSE,
  parent_id UUID REFERENCES public.workspace_files ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, file_path)
);

-- ===================================
-- Projects Table
-- ===================================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('research', 'cultivation', 'analysis', 'experiment')),
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  

);

-- ===================================
-- Research Data Table
-- ===================================

CREATE TABLE IF NOT EXISTS public.research_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects ON DELETE CASCADE,
  data_type TEXT NOT NULL CHECK (data_type IN ('observation', 'measurement', 'analysis', 'note')),
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  attachments UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  

);

-- ===================================
-- Activity Log Table
-- ===================================

CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  

);

-- ===================================
-- Row Level Security Policies
-- ===================================

-- ML Jobs RLS
ALTER TABLE public.ml_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ML jobs" ON public.ml_jobs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ML jobs" ON public.ml_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ML jobs" ON public.ml_jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- File Uploads RLS
ALTER TABLE public.file_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own uploads" ON public.file_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload files" ON public.file_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own uploads" ON public.file_uploads
  FOR DELETE USING (auth.uid() = user_id);

-- Workspace Files RLS
ALTER TABLE public.workspace_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own workspace files" ON public.workspace_files
  FOR ALL USING (auth.uid() = user_id);

-- Projects RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own projects" ON public.projects
  FOR ALL USING (auth.uid() = user_id);

-- Research Data RLS
ALTER TABLE public.research_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own research data" ON public.research_data
  FOR ALL USING (auth.uid() = user_id);

-- Activity Log RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON public.activity_log
  FOR SELECT USING (auth.uid() = user_id);

-- ===================================
-- Functions and Triggers
-- ===================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_files_updated_at BEFORE UPDATE ON public.workspace_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_data_updated_at BEFORE UPDATE ON public.research_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- Storage Buckets
-- ===================================

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('uploads', 'uploads', false),
  ('vision-analysis', 'vision-analysis', false),
  ('workspace', 'workspace', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload to uploads bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own uploads" ON storage.objects
  FOR DELETE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Similar policies for vision-analysis and workspace buckets
CREATE POLICY "Users can manage vision analysis files" ON storage.objects
  FOR ALL USING (bucket_id = 'vision-analysis' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can manage workspace files" ON storage.objects
  FOR ALL USING (bucket_id = 'workspace' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ===================================
-- Indexes for Performance
-- ===================================

-- ML Jobs indexes
CREATE INDEX idx_ml_jobs_user_id ON public.ml_jobs(user_id);
CREATE INDEX idx_ml_jobs_status ON public.ml_jobs(status);
CREATE INDEX idx_ml_jobs_created_at ON public.ml_jobs(created_at DESC);
CREATE INDEX idx_ml_jobs_user_created ON public.ml_jobs(user_id, created_at DESC);

-- File Uploads indexes
CREATE INDEX idx_file_uploads_user_id ON public.file_uploads(user_id);
CREATE INDEX idx_file_uploads_created_at ON public.file_uploads(created_at DESC);
CREATE INDEX idx_file_uploads_user_type ON public.file_uploads(user_id, upload_type);

-- Workspace Files indexes
CREATE INDEX idx_workspace_files_user_id ON public.workspace_files(user_id);
CREATE INDEX idx_workspace_files_project_id ON public.workspace_files(project_id);
CREATE INDEX idx_workspace_files_parent_id ON public.workspace_files(parent_id);

-- Projects indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_is_active ON public.projects(is_active);

-- Research Data indexes
CREATE INDEX idx_research_data_user_id ON public.research_data(user_id);
CREATE INDEX idx_research_data_project_id ON public.research_data(project_id);
CREATE INDEX idx_research_data_tags ON public.research_data USING GIN(tags);

-- Activity Log indexes
CREATE INDEX idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON public.activity_log(created_at DESC);

-- Chat Messages indexes
CREATE INDEX idx_chat_messages_session_created ON public.chat_messages(session_id, created_at DESC);

-- ===================================
-- Views for Dashboard
-- ===================================

CREATE OR REPLACE VIEW public.user_statistics AS
SELECT 
  u.id as user_id,
  COUNT(DISTINCT p.id) as project_count,
  COUNT(DISTINCT cs.id) as chat_session_count,
  COUNT(DISTINCT mj.id) as ml_job_count,
  COUNT(DISTINCT fu.id) as file_upload_count,
  COUNT(DISTINCT CASE WHEN mj.status = 'completed' THEN mj.id END) as completed_ml_jobs,
  COUNT(DISTINCT CASE WHEN mj.created_at > NOW() - INTERVAL '7 days' THEN mj.id END) as recent_ml_jobs,
  MAX(cs.updated_at) as last_activity
FROM auth.users u
LEFT JOIN public.projects p ON u.id = p.user_id
LEFT JOIN public.chat_sessions cs ON u.id = cs.user_id
LEFT JOIN public.ml_jobs mj ON u.id = mj.user_id
LEFT JOIN public.file_uploads fu ON u.id = fu.user_id
GROUP BY u.id;

-- Grant access to the view
GRANT SELECT ON public.user_statistics TO authenticated;

-- ===================================
-- Sample Data for Testing (Optional)
-- ===================================

-- Uncomment to add sample ML job types
-- INSERT INTO public.ml_jobs (user_id, service, status, parameters, result)
-- VALUES 
--   (auth.uid(), 'yield-prediction', 'completed', 
--    '{"species": "oyster", "substrate_weight": 10, "temperature": 22, "humidity": 85, "co2_level": 800}'::jsonb,
--    '{"predicted_yield_kg": 2.5, "efficiency_percent": 85, "harvest_date": "2025-01-20"}'::jsonb);

COMMENT ON SCHEMA public IS 'Crowe Logic AI Platform - Complete Schema v2.1'; 