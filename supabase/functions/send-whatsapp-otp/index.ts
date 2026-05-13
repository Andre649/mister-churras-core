import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone } = await req.json()
    
    if (!phone) {
      return new Response(JSON.stringify({ error: 'Phone is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60000).toISOString() // 5 minutes

    // Save to DB
    const { error: dbError } = await supabaseAdmin
      .from('whatsapp_otps')
      .insert([{ phone, otp_code: otp, expires_at: expiresAt }])

    if (dbError) throw dbError

    // Send via Evolution API
    const evoUrl = Deno.env.get('EVOLUTION_API_URL')
    const evoInstance = Deno.env.get('EVOLUTION_API_INSTANCE')
    const evoApiKey = Deno.env.get('EVOLUTION_API_KEY')

    if (!evoUrl || !evoInstance || !evoApiKey) {
      console.warn("Evolution API is not fully configured, returning OTP for development: ", otp)
      return new Response(JSON.stringify({ success: true, dev_otp: otp }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const message = `🔥 *Mister Churras* 🔥\n\nSeu código de acesso à Caderneta do Mestre é: *${otp}*\n\n(Válido por 5 minutos)`

    const response = await fetch(`${evoUrl}/message/sendText/${evoInstance}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': evoApiKey
      },
      body: JSON.stringify({
        number: phone,
        options: {
          delay: 1200,
          presence: "composing",
        },
        textMessage: {
          text: message
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to send WhatsApp message: ${errorText}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
