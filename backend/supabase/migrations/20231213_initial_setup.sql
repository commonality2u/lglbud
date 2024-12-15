-- Create document status enum
CREATE TYPE document_status AS ENUM ('pending', 'processing', 'completed', 'error');

-- Create document type enum
CREATE TYPE document_type AS ENUM (
  'audio_transcript',
  'email',
  'text_message',
  'court_document',
  'legal_filing'
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  type document_type NOT NULL,
  status document_status DEFAULT 'pending',
  case_number TEXT,
  size TEXT,
  file_path TEXT,
  metadata JSONB DEFAULT '{}',
  user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add RLS (Row Level Security) policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view their own documents"
  ON documents FOR ALL
  USING (user_id = current_user);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column(); 