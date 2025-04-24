'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

interface FileUploaderProps {
  onUploadSuccess: () => void
  uploading: boolean
  uploadProgress: number
}

export default function FileUploader({ onUploadSuccess, uploading, uploadProgress }: FileUploaderProps) {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    try {
      const formData = new FormData()
      formData.append('file', e.target.files[0])

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        toast.success(
          <div>
            <p>File uploaded successfully!</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => window.open(result.url, '_blank')}
                className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Open
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(result.url)}
                className="px-2 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
              >
                Copy URL
              </button>
            </div>
          </div>,
          {
            autoClose: 5000,
            position: 'bottom-right'
          }
        )
        onUploadSuccess()
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Failed to upload file', {
        position: 'bottom-right'
      })
    }
  }

  return (
    <div className="mb-8">
      <label className="relative block w-full border-2 border-dashed border-gray-600 p-8 text-center rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200 bg-gray-800/50 backdrop-blur-sm group">
        <input
          type="file"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-gray-400 group-hover:text-gray-300">
            {uploading ? (
              <div className="space-y-2">
                <div className="text-sm">Uploading... {uploadProgress}%</div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <span>Drop files here or click to upload</span>
            )}
          </div>
        </div>
      </label>
    </div>
  )
}