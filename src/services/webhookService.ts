import { supabase } from '../lib/supabase'

export interface WebhookEvent {
  id: string
  event_type: string
  payload: any
  processed: boolean
  created_at: string
}

export class WebhookService {
  // Send a test webhook to verify connection
  static async sendTestWebhook(webhookUrl: string) {
    try {
      const testPayload = {
        event: 'test_connection',
        data: {
          message: 'Test webhook from Smart Kissan',
          timestamp: new Date().toISOString(),
          source: 'smart_kissan_app'
        },
        timestamp: new Date().toISOString()
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(testPayload)
      })

      if (!response.ok) {
        throw new Error(`Webhook test failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return { success: true, data: result }
    } catch (error) {
      console.error('Webhook test error:', error)
      return { success: false, error: error.message }
    }
  }

  // Send crop update webhook
  static async sendCropUpdate(cropData: any, webhookUrl: string) {
    try {
      const payload = {
        event: 'crop_update',
        data: cropData,
        timestamp: new Date().toISOString()
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(payload)
      })

      return response.ok
    } catch (error) {
      console.error('Crop update webhook error:', error)
      return false
    }
  }

  // Send weather alert webhook
  static async sendWeatherAlert(alertData: any, webhookUrl: string) {
    try {
      const payload = {
        event: 'weather_alert',
        data: alertData,
        timestamp: new Date().toISOString()
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(payload)
      })

      return response.ok
    } catch (error) {
      console.error('Weather alert webhook error:', error)
      return false
    }
  }

  // Get webhook events from database
  static async getWebhookEvents() {
    if (!supabase) return { data: [], error: null }

    const { data, error } = await supabase
      .from('webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    return { data: data || [], error }
  }
}