'use client'

import { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FileUploader from './components/FileUploader'
import FileList from './components/FileList'
import R2ConfigModal from './components/R2ConfigModal'

interface R2Config {
  region: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
}

export default function Home() {
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/files')
      const data = await response.json()
      if (Array.isArray(data)) {
        setFiles(data)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleClearCache = async () => {
    try {
      const response = await fetch('/api/files/clear-cache', {
        method: 'POST',
      })
      if (response.ok) {
        await fetchFiles()
        toast.success('Cache cleared successfully!', {
          position: 'bottom-right'
        })
      }
    } catch (error) {
      toast.error('Failed to clear cache', {
        position: 'bottom-right'
      })
    }
  }

  const handleDelete = async (key: string) => {
    try {
      const response = await fetch('/api/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key }),
      })

      if (response.ok) {
        await fetchFiles()
        toast.success('File deleted successfully!', {
          position: 'bottom-right'
        })
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      toast.error('Failed to delete file', {
        position: 'bottom-right'
      })
    }
  }

  const [r2Config, setR2Config] = useState<R2Config | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)

  useEffect(() => {
    const savedConfig = localStorage.getItem('r2Config')
    if (savedConfig) {
      setR2Config(JSON.parse(savedConfig))
    }
  }, [])

  const handleConfigSave = (config: R2Config) => {
    setR2Config(config)
    setShowConfigModal(false)
    fetchFiles()
  }

  if (!r2Config && !showConfigModal) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <R2ConfigModal onConfigSave={handleConfigSave} />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            File Manager
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Edit Config
            </button>
            <button
              onClick={handleClearCache}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Clear Cache
            </button>
          </div>
        </div>
        
        {showConfigModal && (
          <div className="fixed inset-0 z-50">
            <R2ConfigModal 
              onConfigSave={handleConfigSave}
              initialConfig={r2Config || undefined}
              onCancel={() => setShowConfigModal(false)}
            />
          </div>
        )}
        
        <FileUploader 
          onUploadSuccess={fetchFiles}
          uploading={uploading}
          uploadProgress={uploadProgress}
        />
        
        <FileList 
          files={files}
          onDelete={handleDelete}
        />
      </div>
      <ToastContainer theme="dark" />
    </main>
  )
}
