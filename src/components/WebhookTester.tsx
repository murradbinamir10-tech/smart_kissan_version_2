import React, { useState } from 'react'
import { WebhookService } from '../services/webhookService'
import { Send, CheckCircle, XCircle, Loader } from 'lucide-react'

interface WebhookTesterProps {
  webhookUrl: string
}

export function WebhookTester({ webhookUrl }: WebhookTesterProps) {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const testWebhook = async () => {
    setTesting(true)
    setResult(null)

    try {
      const response = await WebhookService.sendTestWebhook(webhookUrl)
      
      if (response.success) {
        setResult({
          success: true,
          message: 'Webhook connection successful! Test payload delivered.'
        })
      } else {
        setResult({
          success: false,
          message: `Webhook test failed: ${response.error}`
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: `Connection error: ${error.message}`
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Connection Test</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Webhook URL
        </label>
        <div className="bg-gray-50 p-3 rounded-md border">
          <code className="text-sm text-gray-800 break-all">{webhookUrl}</code>
        </div>
      </div>

      <button
        onClick={testWebhook}
        disabled={testing}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {testing ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {testing ? 'Testing Connection...' : 'Test Webhook'}
      </button>

      {result && (
        <div className={`mt-4 p-3 rounded-md flex items-center gap-2 ${
          result.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {result.success ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm ${
            result.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {result.message}
          </span>
        </div>
      )}
    </div>
  )
}