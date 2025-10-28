-- Create contact table for contact form submissions
CREATE TABLE IF NOT EXISTS public.contact (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_email ON public.contact(email);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact(status);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON public.contact(created_at);

-- Enable RLS
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow public to insert contact messages
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact;
CREATE POLICY "Anyone can insert contact messages" ON public.contact
    FOR INSERT WITH CHECK (true);

-- Only authenticated users can view contact messages (for admin purposes)
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON public.contact;
CREATE POLICY "Authenticated users can view contact messages" ON public.contact
    FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated users can update contact messages (for admin purposes)
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON public.contact;
CREATE POLICY "Authenticated users can update contact messages" ON public.contact
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_contact_updated_at ON public.contact;
CREATE TRIGGER update_contact_updated_at
    BEFORE UPDATE ON public.contact
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_updated_at_column();
