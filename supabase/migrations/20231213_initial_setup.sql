-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create enum types
CREATE TYPE deadline_category AS ENUM (
    'DISCOVERY',
    'MOTION',
    'TRIAL',
    'PRETRIAL',
    'HEARING',
    'CONFERENCE',
    'OTHER'
);

CREATE TYPE deadline_status AS ENUM (
    'ACTIVE',
    'SUPERSEDED',
    'COMPLETED'
);

CREATE TYPE document_type AS ENUM (
    'SCHEDULING_ORDER',
    'AMENDED_SCHEDULING_ORDER'
);

-- Create scheduling_orders table
CREATE TABLE scheduling_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number TEXT NOT NULL,
    document_type document_type NOT NULL,
    filing_date TIMESTAMP WITH TIME ZONE,
    court_name TEXT,
    judge_name TEXT,
    original_filename TEXT NOT NULL,
    file_hash TEXT NOT NULL UNIQUE,
    extraction_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar_deadlines table
CREATE TABLE calendar_deadlines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheduling_order_id UUID REFERENCES scheduling_orders(id) NOT NULL,
    title TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT,
    category deadline_category NOT NULL,
    status deadline_status NOT NULL DEFAULT 'ACTIVE',
    confidence_score FLOAT NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_scheduling_orders_case_number ON scheduling_orders(case_number);
CREATE INDEX idx_scheduling_orders_file_hash ON scheduling_orders(file_hash);
CREATE INDEX idx_calendar_deadlines_due_date ON calendar_deadlines(due_date);
CREATE INDEX idx_calendar_deadlines_scheduling_order ON calendar_deadlines(scheduling_order_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_scheduling_orders_updated_at
    BEFORE UPDATE ON scheduling_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_deadlines_updated_at
    BEFORE UPDATE ON calendar_deadlines
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE scheduling_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_deadlines ENABLE ROW LEVEL SECURITY;

-- Create policies for scheduling_orders
CREATE POLICY "Enable read access for authenticated users" ON scheduling_orders
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON scheduling_orders
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policies for calendar_deadlines
CREATE POLICY "Enable read access for authenticated users" ON calendar_deadlines
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON calendar_deadlines
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('scheduling-orders', 'scheduling-orders', false);

-- Create storage policies
CREATE POLICY "Enable read access for authenticated users"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'scheduling-orders');

CREATE POLICY "Enable upload access for authenticated users"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'scheduling-orders'); 