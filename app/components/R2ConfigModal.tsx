'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

interface R2Config {
  region: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
}

interface R2ConfigModalProps {
  onConfigSave: (config: R2Config) => void
  initialConfig?: R2Config
  onCancel?: () => void
}

export default function R2ConfigModal({ onConfigSave, initialConfig, onCancel }: R2ConfigModalProps) {
  const [config, setConfig] = useState<R2Config>(() => initialConfig || {
    region: 'auto',
    endpoint: '',
    accessKeyId: '',
    secretAccessKey: '',
    bucket: ''
  })

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig)
    }
  }, [initialConfig])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Store in localStorage for client-side access
    localStorage.setItem('r2Config', JSON.stringify(config))
    
    // Store in cookies for server-side access
    document.cookie = `r2Config=${JSON.stringify(config)}; path=/; max-age=31536000`
    
    onConfigSave(config)
    toast.success('R2 configuration saved successfully!', {
      position: 'bottom-right'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-white">R2 Configuration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Region</label>
            <input
              type="text"
              value={config.region}
              onChange={(e) => setConfig({ ...config, region: e.target.value })}
              className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Endpoint</label>
            <input
              type="text"
              value={config.endpoint}
              onChange={(e) => setConfig({ ...config, endpoint: e.target.value })}
              className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Access Key ID</label>
            <input
              type="text"
              value={config.accessKeyId}
              onChange={(e) => setConfig({ ...config, accessKeyId: e.target.value })}
              className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Secret Access Key</label>
            <input
              type="password"
              value={config.secretAccessKey}
              onChange={(e) => setConfig({ ...config, secretAccessKey: e.target.value })}
              className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bucket Name</label>
            <input
              type="text"
              value={config.bucket}
              onChange={(e) => setConfig({ ...config, bucket: e.target.value })}
              className="w-full bg-gray-700 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}