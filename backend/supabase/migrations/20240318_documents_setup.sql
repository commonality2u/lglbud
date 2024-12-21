-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    case_number TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    size BIGINT,
    content TEXT,
    user_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audio_transcripts table
CREATE TABLE IF NOT EXISTS audio_transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    duration TEXT,
    speaker_count INTEGER,
    confidence_score FLOAT,
    has_timestamps BOOLEAN DEFAULT false,
    transcript_text TEXT,
    speakers JSONB DEFAULT '[]',
    segments JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emails table
CREATE TABLE IF NOT EXISTS emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    sender TEXT,
    recipients JSONB DEFAULT '[]',
    subject TEXT,
    sent_date TIMESTAMP WITH TIME ZONE,
    thread_id TEXT,
    has_attachments BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]',
    email_content TEXT,
    headers JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create text_messages table
CREATE TABLE IF NOT EXISTS text_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    sender TEXT,
    recipients JSONB DEFAULT '[]',
    message_date TIMESTAMP WITH TIME ZONE,
    thread_id TEXT,
    has_attachments BOOLEAN DEFAULT false,
    attachments JSONB DEFAULT '[]',
    message_content TEXT,
    platform TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create legal_filings table
CREATE TABLE IF NOT EXISTS legal_filings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    filing_type TEXT,
    filing_date DATE,
    court TEXT,
    case_number TEXT,
    parties JSONB DEFAULT '[]',
    has_exhibits BOOLEAN DEFAULT false,
    exhibits JSONB DEFAULT '[]',
    filing_content TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    invoice_number TEXT,
    vendor TEXT,
    issue_date DATE,
    due_date DATE,
    amount DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    items JSONB DEFAULT '[]',
    payment_terms TEXT,
    billing_address TEXT,
    shipping_address TEXT,
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);
CREATE INDEX IF NOT EXISTS idx_documents_case_number ON documents(case_number);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);

CREATE INDEX IF NOT EXISTS idx_audio_transcripts_document_id ON audio_transcripts(document_id);
CREATE INDEX IF NOT EXISTS idx_audio_transcripts_speaker_count ON audio_transcripts(speaker_count);

CREATE INDEX IF NOT EXISTS idx_emails_document_id ON emails(document_id);
CREATE INDEX IF NOT EXISTS idx_emails_sender ON emails(sender);
CREATE INDEX IF NOT EXISTS idx_emails_sent_date ON emails(sent_date);
CREATE INDEX IF NOT EXISTS idx_emails_thread_id ON emails(thread_id);

CREATE INDEX IF NOT EXISTS idx_text_messages_document_id ON text_messages(document_id);
CREATE INDEX IF NOT EXISTS idx_text_messages_sender ON text_messages(sender);
CREATE INDEX IF NOT EXISTS idx_text_messages_message_date ON text_messages(message_date);
CREATE INDEX IF NOT EXISTS idx_text_messages_thread_id ON text_messages(thread_id);

CREATE INDEX IF NOT EXISTS idx_legal_filings_document_id ON legal_filings(document_id);
CREATE INDEX IF NOT EXISTS idx_legal_filings_filing_type ON legal_filings(filing_type);
CREATE INDEX IF NOT EXISTS idx_legal_filings_filing_date ON legal_filings(filing_date);
CREATE INDEX IF NOT EXISTS idx_legal_filings_case_number ON legal_filings(case_number);

CREATE INDEX IF NOT EXISTS idx_invoices_document_id ON invoices(document_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_vendor ON invoices(vendor);
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audio_transcripts_updated_at
    BEFORE UPDATE ON audio_transcripts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emails_updated_at
    BEFORE UPDATE ON emails
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_text_messages_updated_at
    BEFORE UPDATE ON text_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_filings_updated_at
    BEFORE UPDATE ON legal_filings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents
CREATE POLICY "Enable read access for authenticated users"
    ON documents FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON documents FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON documents FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create RLS policies for audio_transcripts
CREATE POLICY "Enable read access for authenticated users"
    ON audio_transcripts FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON audio_transcripts FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON audio_transcripts FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create RLS policies for emails
CREATE POLICY "Enable read access for authenticated users"
    ON emails FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON emails FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON emails FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create RLS policies for text_messages
CREATE POLICY "Enable read access for authenticated users"
    ON text_messages FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON text_messages FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON text_messages FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create RLS policies for legal_filings
CREATE POLICY "Enable read access for authenticated users"
    ON legal_filings FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON legal_filings FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON legal_filings FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create RLS policies for invoices
CREATE POLICY "Enable read access for authenticated users"
    ON invoices FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users"
    ON invoices FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
    ON invoices FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create documents storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for documents bucket
CREATE POLICY "Enable read access for authenticated users"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'documents');

CREATE POLICY "Enable upload access for authenticated users"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Enable update access for authenticated users"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'documents');

CREATE POLICY "Enable delete access for authenticated users"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'documents'); 