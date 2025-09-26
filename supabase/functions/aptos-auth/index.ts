import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';
import { Aptos, AptosConfig, Network, Ed25519PublicKey, Ed25519Signature } from "https://esm.sh/@aptos-labs/ts-sdk@1.32.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(aptosConfig);

    if (req.method === 'GET') {
      // Generate sign-in message (nonce)
      const nonce = crypto.randomUUID();
      const timestamp = Date.now();
      const message = `Sign in to Garden of Giving\n\nNonce: ${nonce}\nTimestamp: ${timestamp}`;
      
      console.log('Generated sign-in message:', message);
      
      return new Response(JSON.stringify({ 
        message,
        nonce,
        timestamp 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const { publicKey, signature, message, walletAddress } = await req.json();
      
      console.log('Received verification request:', { publicKey, walletAddress });

      if (!publicKey || !signature || !message || !walletAddress) {
        return new Response(JSON.stringify({ 
          error: 'Missing required parameters' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        // Verify the signature using Aptos SDK
        const pubKey = new Ed25519PublicKey(publicKey);
        const sig = new Ed25519Signature(signature);
        
        const messageBytes = new TextEncoder().encode(message);
        const isValid = pubKey.verifySignature({ message: messageBytes, signature: sig });
        
        if (!isValid) {
          console.log('Invalid signature');
          return new Response(JSON.stringify({ 
            error: 'Invalid signature' 
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        console.log('Signature verified successfully');

        // Check if user exists in profiles table
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking profile:', profileError);
          throw profileError;
        }

        let userId;
        
        if (!existingProfile) {
          console.log('Creating new user profile');
          
          // Create user in auth.users
          const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            user_metadata: { 
              wallet_address: walletAddress,
              public_key: publicKey 
            }
          });

          if (authError) {
            console.error('Error creating auth user:', authError);
            throw authError;
          }

          userId = authUser.user.id;

          // Create profile
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              wallet_address: walletAddress,
              name: `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
            });

          if (insertError) {
            console.error('Error creating profile:', insertError);
            throw insertError;
          }
        } else {
          userId = existingProfile.id;
        }

        // Generate JWT token
        const { data: session, error: sessionError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: `${walletAddress}@aptos.wallet`,
          options: {
            data: {
              wallet_address: walletAddress,
              public_key: publicKey
            }
          }
        });

        if (sessionError) {
          console.error('Error generating session:', sessionError);
          throw sessionError;
        }

        // Create a proper session
        const { data: sessionData, error: signInError } = await supabase.auth.admin.createUser({
          user_metadata: { 
            wallet_address: walletAddress,
            public_key: publicKey 
          },
          email: `${walletAddress}@aptos.wallet`,
          email_confirm: true
        });

        if (signInError && signInError.message !== 'User already registered') {
          console.error('Error signing in user:', signInError);
          throw signInError;
        }

        console.log('Authentication successful');

        return new Response(JSON.stringify({ 
          success: true,
          user: {
            id: userId,
            wallet_address: walletAddress,
            public_key: publicKey
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (verificationError) {
        console.error('Signature verification error:', verificationError);
        return new Response(JSON.stringify({ 
          error: 'Signature verification failed',
          details: verificationError.message 
        }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ 
      error: 'Method not allowed' 
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});