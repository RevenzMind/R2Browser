'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

// File type definitions
interface FileProps {
  Key: string
  LastModified: string
  Size: number
  url?: string
  isImage?: boolean
  contentType?: string
}

interface FileListProps {
  files: FileProps[]
  onDelete: (key: string) => void
}

interface FileIconProps {
  fileName: string
  baseStyle?: string
}

interface BaseSvgProps {
  color: string
  symbol: string
  baseStyle?: string
}

const getBaseSvg = ({ color, symbol, baseStyle = "w-12 h-12" }: BaseSvgProps) => (
  <svg className={`${baseStyle} ${color}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <text 
      x="12" 
      y="16" 
      textAnchor="middle" 
      fill="currentColor" 
      fontSize="6"
    >
      {symbol}
    </text>
  </svg>
)

const getFileIcon = ({ fileName, baseStyle }: FileIconProps) => {
  const extension = fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return getBaseSvg({ color: "text-yellow-500", symbol: "ZIP", baseStyle });
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'm4a':
      return getBaseSvg({ color: "text-blue-500", symbol: "AUD", baseStyle });
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'mkv':
      return getBaseSvg({ color: "text-purple-500", symbol: "VID", baseStyle });
    case 'doc':
    case 'docx':
      return getBaseSvg({ color: "text-blue-600", symbol: "DOC", baseStyle });
    case 'xls':
    case 'xlsx':
    case 'csv':
      return getBaseSvg({ color: "text-green-600", symbol: "XLS", baseStyle });
    case 'pdf':
      return getBaseSvg({ color: "text-red-500", symbol: "PDF", baseStyle });
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'py':
    case 'java':
    case 'cpp':
    case 'html':
    case 'css':
      return getBaseSvg({ color: "text-gray-300", symbol: "<>", baseStyle });
    default:
      return getBaseSvg({ color: "text-gray-400", symbol: "FILE", baseStyle });
  }
};

interface FileCardProps {
  file: FileProps
  onDelete: (key: string) => void
}

const FileCard = ({ file, onDelete }: FileCardProps) => (
  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 flex flex-col hover:border-gray-700 transition-colors duration-200">
    <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg flex items-center justify-center bg-black/50">
      {file.isImage && file.url ? (
        <img
          src={file.url}
          alt={file.Key}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          {getFileIcon({ fileName: file.Key })}
        </div>
      )}
    </div>
    <div className="flex justify-between items-start">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-200 truncate" title={file.Key}>
          {file.Key}
        </h3>
        <p className="text-sm text-gray-400">
          {new Date(file.LastModified).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-400">
          {(file.Size / 1024).toFixed(2)} KB
        </p>
      </div>
      <div className="flex gap-2 ml-2">
        {file.url && (
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-3 py-1 bg-gray-900 text-white rounded border border-gray-800 hover:border-blue-500/50 transition-all duration-200"
          >
            <span className="relative z-10">Open</span>
            <div className="absolute inset-0 rounded bg-gradient-to-r from-blue-500/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </a>
        )}
        <button
          onClick={() => onDelete(file.Key)}
          className="group relative px-3 py-1 bg-gray-900 text-white rounded border border-gray-800 hover:border-red-500/50 transition-all duration-200"
        >
          <span className="relative z-10">Delete</span>
          <div className="absolute inset-0 rounded bg-gradient-to-r from-red-500/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </button>
      </div>
    </div>
  </div>
)

const FileRow = ({ file, onDelete }: FileCardProps) => (
  <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 flex items-center hover:border-gray-700 transition-colors duration-200">
    <div className="h-12 w-12 mr-4 flex items-center justify-center bg-black/50 rounded-lg">
      {file.isImage && file.url ? (
        <img
          src={file.url}
          alt={file.Key}
          className="h-full w-full object-cover rounded-lg"
        />
      ) : (
        getFileIcon({ fileName: file.Key })
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-semibold text-gray-200 truncate" title={file.Key}>
        {file.Key}
      </h3>
      <div className="flex gap-4">
        <p className="text-sm text-gray-400">
          {new Date(file.LastModified).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-400">
          {(file.Size / 1024).toFixed(2)} KB
        </p>
      </div>
    </div>
    <div className="flex gap-2 ml-4">
      {file.url && (
        <a
          href={file.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative px-3 py-1 bg-gray-900 text-white rounded border border-gray-800 hover:border-blue-500/50 transition-all duration-200"
        >
          <span className="relative z-10">Open</span>
          <div className="absolute inset-0 rounded bg-gradient-to-r from-blue-500/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </a>
      )}
      <button
        onClick={() => onDelete(file.Key)}
        className="group relative px-3 py-1 bg-gray-900 text-white rounded border border-gray-800 hover:border-red-500/50 transition-all duration-200"
      >
        <span className="relative z-10">Delete</span>
        <div className="absolute inset-0 rounded bg-gradient-to-r from-red-500/20 to-red-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </button>
    </div>
  </div>
)

export default function FileList({ files, onDelete }: FileListProps) {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')

  // Sort files by LastModified date in descending order (newest first)
  const sortedFiles = [...files].sort((a, b) => {
    return new Date(b.LastModified).getTime() - new Date(a.LastModified).getTime()
  })

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="bg-gray-900 rounded-lg p-1 border border-gray-800">
          <button
            onClick={() => setViewType('grid')}
            className={`px-3 py-1 rounded ${
              viewType === 'grid'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            } transition-colors`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewType('list')}
            className={`px-3 py-1 rounded ${
              viewType === 'list'
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:text-white'
            } transition-colors`}
          >
            List
          </button>
        </div>
      </div>

      <div className={
        viewType === 'grid'
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "flex flex-col gap-4"
      }>
        {sortedFiles.map((file) => (
          viewType === 'grid' ? (
            <FileCard 
              key={file.Key} 
              file={file} 
              onDelete={onDelete}
            />
          ) : (
            <FileRow
              key={file.Key}
              file={file}
              onDelete={onDelete}
            />
          )
        ))}
      </div>
    </div>
  )
}

const handleCopyUrl = async (url: string): Promise<void> => {
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