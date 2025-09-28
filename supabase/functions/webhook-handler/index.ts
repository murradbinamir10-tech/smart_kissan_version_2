import { corsHeaders } from '../_shared/cors.ts'

interface WebhookPayload {
  event: string
  data: any
  timestamp: string
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    // Only allow POST requests for webhook
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      )
    }

    // Parse the webhook payload
    const payload: WebhookPayload = await req.json()
    
    console.log('Webhook received:', {
      event: payload.event,
      timestamp: payload.timestamp,
      data: payload.data
    })

    // Process different webhook events
    switch (payload.event) {
      case 'crop_update':
        await handleCropUpdate(payload.data)
        break
      case 'weather_alert':
        await handleWeatherAlert(payload.data)
        break
      case 'sensor_data':
        await handleSensorData(payload.data)
        break
      default:
        console.log('Unknown webhook event:', payload.event)
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully',
        event: payload.event 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )

  } catch (error) {
    console.error('Webhook processing error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    )
  }
})

async function handleCropUpdate(data: any) {
  console.log('Processing crop update:', data)
  // Add your crop update logic here
  // For example: update crop status in database
}

async function handleWeatherAlert(data: any) {
  console.log('Processing weather alert:', data)
  // Add your weather alert logic here
  // For example: send notifications to farmers
}

async function handleSensorData(data: any) {
  console.log('Processing sensor data:', data)
  // Add your sensor data processing logic here
  // For example: store sensor readings in database
}