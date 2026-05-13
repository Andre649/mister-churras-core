-- Create event_guests junction table
CREATE TABLE IF NOT EXISTS public.event_guests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.event_guests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own event_guests"
ON public.event_guests
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.events
        WHERE events.id = event_guests.event_id
        AND events.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.events
        WHERE events.id = event_guests.event_id
        AND events.user_id = auth.uid()
    )
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS event_guests_event_id_idx ON public.event_guests(event_id);
CREATE INDEX IF NOT EXISTS event_guests_guest_id_idx ON public.event_guests(guest_id);
