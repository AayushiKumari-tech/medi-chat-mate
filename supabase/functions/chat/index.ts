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
    const { messages, sessionId } = await req.json();
    console.log("Chat request received", { sessionId, messageCount: messages.length });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not found");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch doctors for context
    const { data: doctors } = await supabase
      .from('doctors')
      .select('*');

    // Build system prompt with hospital information
    const systemPrompt = `You are a helpful AI assistant for HospitalCare, a modern healthcare facility. Your role is to help patients with:

1. **Booking Appointments**: Help patients schedule appointments with our doctors
2. **Doctor Information**: Provide information about our specialists
3. **FAQs**: Answer common questions about visiting hours, services, etc.
4. **Symptom Triage**: Provide basic health guidance (NOT medical diagnosis)

Our Doctors:
${doctors?.map(d => `- ${d.name}: ${d.specialty} (Available ${d.available_days}, ${d.start_hour}:00-${d.end_hour}:00)`).join('\n')}

Hospital Information:
- Visiting Hours: 9:00 AM - 8:00 PM daily
- Emergency Contact: 911 or (555) 123-4567
- Address: 123 Healthcare Avenue, Medical City

Important Guidelines:
- Be friendly, professional, and empathetic
- For booking appointments, collect: patient name, phone, preferred doctor/specialty, date, and time
- If symptoms sound serious (chest pain, difficulty breathing, severe bleeding, etc.), immediately advise calling 911
- Always clarify that you provide guidance, not diagnosis
- Keep responses concise and helpful

When helping with appointments, guide the conversation step by step.`;

    // Call Lovable AI
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status, await response.text());
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service unavailable. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    // Store conversation in database (fire and forget)
    if (sessionId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      supabase
        .from('conversations')
        .insert({
          session_id: sessionId,
          role: lastMessage.role,
          content: lastMessage.content,
        })
        .then(() => console.log("Conversation stored"));
    }

    // Return streaming response
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
