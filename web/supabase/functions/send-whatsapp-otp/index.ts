// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
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

    // Try to send via Custom Mister Gateway
    const gatewayUrl = Deno.env.get('GATEWAY_URL')
    const gatewayKey = Deno.env.get('GATEWAY_API_KEY') || 'mister-churras-secret-2024'

    if (gatewayUrl) {
      // Gateway is configured — attempt to send the message
      try {
        const message = `🔥 *Mister Churras* 🔥\n\nSeu código de acesso à Caderneta do Mestre é: *${otp}*\n\n(Válido por 5 minutos)`
        await fetch(`${gatewayUrl}/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': gatewayKey
          },
          body: JSON.stringify({ number: phone, text: message })
        })
        // Message sent successfully — don't return OTP
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      } catch (_gatewayErr) {
        // Gateway is configured but failed — fall through to dev_otp fallback
        console.warn('Gateway configured but unreachable, falling back to dev_otp')
      }
    }

    // FALLBACK MODE: Gateway not configured or failed.
    // Return the OTP in the response so user can enter it manually.
    return new Response(JSON.stringify({ success: true, dev_otp: otp, fallback: true }), {
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

