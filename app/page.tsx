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
  const [loading, setLoading] = useState(true)
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/files')
      const data = await response.json()
      if (Array.isArray(data)) {
        // Transform the data to include image information
        const filesWithUrls = data.map(file => ({
          ...file,
          isImage: file.Key.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null
        }))
        setFiles(filesWithUrls)
      }
    } catch (error) {
      console.error('Error fetching files:', error)
      toast.error('Failed to fetch files')
    } finally {
      setLoading(false)
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
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            File Manager
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfigModal(true)}
              className="group relative px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <span className="relative z-10">Edit Config</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
            <button
              onClick={handleClearCache}
              className="group relative px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            >
              <span className="relative z-10">Clear Cache</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
          </div>
        </div>
        
        {showConfigModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
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
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : (
          <FileList 
            files={files}
            onDelete={handleDelete}
          />
        )}
      </div>
      <ToastContainer 
        theme="dark"
        toastClassName="bg-gray-900 text-white border border-gray-800"
      />
    </main>
  )
}
