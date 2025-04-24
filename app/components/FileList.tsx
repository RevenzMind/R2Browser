'use client'

import { toast } from 'react-toastify'

interface FileListProps {
  files: any[]
  onDelete: (key: string) => void
}

export default function FileList({ files, onDelete }: FileListProps) {
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('URL copied to clipboard!', {
        position: 'bottom-right'
      })
    } catch (error) {
      toast.error('Failed to copy URL', {
        position: 'bottom-right'
      })
    }
  }

  return (
    <div className="grid gap-4">
      {files.map((file) => (
        <div
          key={file.Key}
          className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-gray-700 rounded-lg">
              <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-200 font-medium">{file.Key}</p>
              <p className="text-gray-400 text-sm">{(file.Size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleCopyUrl(file.url)}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Copy URL
            </button>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              View
            </a>
            <button
              onClick={() => onDelete(file.Key)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}