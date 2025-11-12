-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  available_days TEXT NOT NULL,
  start_hour INTEGER NOT NULL,
  end_hour INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversations table
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create policies for doctors (public read)
CREATE POLICY "Doctors are viewable by everyone"
ON public.doctors
FOR SELECT
USING (true);

-- Create policies for appointments (public access for demo)
CREATE POLICY "Anyone can view appointments"
ON public.appointments
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create appointments"
ON public.appointments
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update appointments"
ON public.appointments
FOR UPDATE
USING (true);

-- Create policies for conversations (public access for demo)
CREATE POLICY "Anyone can view conversations"
ON public.conversations
FOR SELECT
USING (true);

CREATE POLICY "Anyone can create conversations"
ON public.conversations
FOR INSERT
WITH CHECK (true);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for appointments
CREATE TRIGGER update_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed sample doctors
INSERT INTO public.doctors (name, specialty, available_days, start_hour, end_hour) VALUES
  ('Dr. Sarah Johnson', 'Cardiology', 'Mon-Fri', 9, 17),
  ('Dr. Michael Chen', 'Orthopedics', 'Mon-Thu', 10, 18),
  ('Dr. Emily Rodriguez', 'Pediatrics', 'Tue-Sat', 8, 16),
  ('Dr. James Wilson', 'Neurology', 'Mon-Wed', 11, 19),
  ('Dr. Priya Patel', 'General Medicine', 'Mon-Fri', 9, 18);