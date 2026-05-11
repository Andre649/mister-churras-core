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
    const { phone, token } = await req.json()
    
    if (!phone || !token) {
      return new Response(JSON.stringify({ error: 'Phone and token are required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check DB
    const { data, error } = await supabaseAdmin
      .from('whatsapp_otps')
      .select('*')
      .eq('phone', phone)
      .eq('otp_code', token)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Código inválido ou expirado' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Delete OTP to prevent reuse
    await supabaseAdmin.from('whatsapp_otps').delete().eq('id', data.id)

    // Create or find user in Auth
    const { data: userResponse, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    // Supabase armazena números sem o '+'
    const normalizedPhone = phone.replace('+', '')
    let user = userResponse?.users.find(u => u.phone === phone || u.phone === normalizedPhone)

    const userPassword = phone + (Deno.env.get('PHONE_AUTH_SECRET') || 's3cr3tM1st3rVite')

    if (!user) {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        phone: phone,
        password: userPassword,
        phone_confirm: true,
      })
      if (createError) throw createError
      user = newUser.user
    } else {
      // update password to ensure it matches
      await supabaseAdmin.auth.admin.updateUserById(user.id, { password: userPassword, phone_confirm: true })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      session_password: userPassword 
    }), {
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
