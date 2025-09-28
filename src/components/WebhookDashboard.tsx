import React, { useState, useEffect } from 'react'
import { WebhookService, WebhookEvent } from '../services/webhookService'
import { WebhookTester } from './WebhookTester'
import { Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const WEBHOOK_URL = 'https://8f12498ee627.ngrok-free.app/webhook/e321d96c-a2fe-48c1-96cf-3ceadf97016a'

export function WebhookDashboard() {
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWebhookEvents()
  }, [])

  const loadWebhookEvents = async () => {
    setLoading(true)
    const { data, error } = await WebhookService.getWebhookEvents()
    if (!error && data) {
      setEvents(data)
    }
    setLoading(false)
  }

  const sendSampleCropUpdate = async () => {
    const sampleData = {
      crop_id: 'crop_001',
      crop_type: 'wheat',
      growth_stage: 'flowering',
      health_status: 'healthy',
      location: { lat: 28.6139, lng: 77.2090 },
      updated_by: 'farmer_001'
    }

    await WebhookService.sendCropUpdate(sampleData, WEBHOOK_URL)
    await loadWebhookEvents()
  }

  const sendSampleWeatherAlert = async () => {
    const sampleData = {
      alert_type: 'heavy_rain',
      severity: 'high',
      location: { lat: 28.6139, lng: 77.2090 },
      message: 'Heavy rainfall expected in the next 24 hours. Protect your crops.',
      valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }

    await WebhookService.sendWeatherAlert(sampleData, WEBHOOK_URL)
    await loadWebhookEvents()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Webhook Integration</h2>
        </div>

        <WebhookTester webhookUrl={WEBHOOK_URL} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Sample Webhooks</h3>
        <div className="flex gap-4">
          <button
            onClick={sendSampleCropUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Send Crop Update
          </button>
          <button
            onClick={sendSampleWeatherAlert}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Send Weather Alert
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Webhook Events</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No webhook events found</p>
            <p className="text-sm text-gray-500 mt-1">
              Test the webhook connection or send sample data to see events here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                      {event.event_type}
                    </span>
                    {event.processed ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(event.created_at).toLocaleString()}
                  </span>
                </div>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(event.payload, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}