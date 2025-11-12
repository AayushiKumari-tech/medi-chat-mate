import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientName, patientPhone, doctorId, appointmentDate, appointmentTime } = await req.json();
    console.log("Booking appointment", { patientName, doctorId, appointmentDate, appointmentTime });

    // Validate input
    if (!patientName || !patientPhone || !doctorId || !appointmentDate || !appointmentTime) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if doctor exists
    const { data: doctor, error: doctorError } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', doctorId)
      .single();

    if (doctorError || !doctor) {
      return new Response(JSON.stringify({ error: "Doctor not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for existing appointment at the same time
    const { data: existingAppointment } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('appointment_date', appointmentDate)
      .eq('appointment_time', appointmentTime)
      .neq('status', 'cancelled')
      .single();

    if (existingAppointment) {
      return new Response(JSON.stringify({ error: "This time slot is already booked" }), {
        status: 409,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert({
        patient_name: patientName,
        patient_phone: patientPhone,
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: 'confirmed',
      })
      .select()
      .single();

    if (appointmentError) {
      console.error("Error creating appointment:", appointmentError);
      throw new Error("Failed to create appointment");
    }

    console.log("Appointment created:", appointment.id);
    console.log(`📧 Notification: Appointment confirmed for ${patientName} with ${doctor.name} on ${appointmentDate} at ${appointmentTime}`);

    return new Response(JSON.stringify({
      success: true,
      appointment,
      message: `Appointment confirmed with ${doctor.name} on ${appointmentDate} at ${appointmentTime}`,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Booking error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
