-- ===================================
-- Real-time Collaboration Tables
-- ===================================

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'collaboration')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Collaboration sessions table
CREATE TABLE IF NOT EXISTS public.collaboration_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('document', 'project', 'research')),
  owner_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collaboration participants table
CREATE TABLE IF NOT EXISTS public.collaboration_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.collaboration_sessions ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(session_id, user_id)
);

-- Shared documents table
CREATE TABLE IF NOT EXISTS public.shared_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.collaboration_sessions ON DELETE CASCADE,
  file_id UUID REFERENCES public.workspace_files ON DELETE CASCADE,
  shared_by UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  permissions JSONB DEFAULT '{"read": true, "write": false, "delete": false}',
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(session_id, file_id)
);

-- ===================================
-- Row Level Security
-- ===================================

-- Notifications RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Collaboration sessions RLS
ALTER TABLE public.collaboration_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view sessions they participate in" ON public.collaboration_sessions
  FOR SELECT USING (
    auth.uid() = owner_id OR 
    EXISTS (
      SELECT 1 FROM public.collaboration_participants 
      WHERE session_id = collaboration_sessions.id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create sessions" ON public.collaboration_sessions
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update sessions" ON public.collaboration_sessions
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete sessions" ON public.collaboration_sessions
  FOR DELETE USING (auth.uid() = owner_id);

-- Participants RLS
ALTER TABLE public.collaboration_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view session members" ON public.collaboration_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.collaboration_participants p
      WHERE p.session_id = collaboration_participants.session_id 
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Session owners can manage participants" ON public.collaboration_participants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.collaboration_sessions s
      WHERE s.id = session_id 
      AND s.owner_id = auth.uid()
    )
  );

-- Shared documents RLS
ALTER TABLE public.shared_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shared documents" ON public.shared_documents
  FOR SELECT USING (
    auth.uid() = shared_by OR
    EXISTS (
      SELECT 1 FROM public.collaboration_participants p
      WHERE p.session_id = shared_documents.session_id 
      AND p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can share their documents" ON public.shared_documents
  FOR INSERT WITH CHECK (
    auth.uid() = shared_by AND
    EXISTS (
      SELECT 1 FROM public.workspace_files f
      WHERE f.id = file_id 
      AND f.user_id = auth.uid()
    )
  );

-- ===================================
-- Real-time Subscriptions Setup
-- ===================================

-- Enable real-time for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Enable real-time for collaboration sessions
ALTER PUBLICATION supabase_realtime ADD TABLE public.collaboration_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.collaboration_participants;

-- ===================================
-- Helper Functions
-- ===================================

-- Function to create a notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to invite user to collaboration session
CREATE OR REPLACE FUNCTION invite_to_collaboration(
  p_session_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'viewer'
)
RETURNS BOOLEAN AS $$
DECLARE
  v_session_name TEXT;
  v_inviter_name TEXT;
BEGIN
  -- Check if inviter owns the session
  IF NOT EXISTS (
    SELECT 1 FROM public.collaboration_sessions 
    WHERE id = p_session_id AND owner_id = auth.uid()
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Get session and inviter info
  SELECT s.name, p.email 
  INTO v_session_name, v_inviter_name
  FROM public.collaboration_sessions s
  JOIN public.profiles p ON p.id = auth.uid()
  WHERE s.id = p_session_id;
  
  -- Add participant
  INSERT INTO public.collaboration_participants (session_id, user_id, role)
  VALUES (p_session_id, p_user_id, p_role)
  ON CONFLICT (session_id, user_id) DO UPDATE SET role = p_role;
  
  -- Create notification
  PERFORM create_notification(
    p_user_id,
    'collaboration',
    'Collaboration Invitation',
    format('%s invited you to collaborate on "%s"', v_inviter_name, v_session_name),
    jsonb_build_object('session_id', p_session_id, 'role', p_role)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===================================
-- Indexes for Performance
-- ===================================

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Collaboration sessions indexes
CREATE INDEX idx_collaboration_sessions_owner ON public.collaboration_sessions(owner_id);
CREATE INDEX idx_collaboration_sessions_active ON public.collaboration_sessions(is_active);

-- Collaboration participants indexes
CREATE INDEX idx_collaboration_participants_session ON public.collaboration_participants(session_id);
CREATE INDEX idx_collaboration_participants_user ON public.collaboration_participants(user_id);

-- Shared documents indexes
CREATE INDEX idx_shared_documents_session ON public.shared_documents(session_id);
CREATE INDEX idx_shared_documents_file ON public.shared_documents(file_id);

COMMENT ON SCHEMA public IS 'Crowe Logic AI Platform - Real-time Collaboration Extension v1.0'; 