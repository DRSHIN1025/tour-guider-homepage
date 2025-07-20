import React, { useCallback, useState } from 'react'
import { Button } from './button'
import { X, Upload, FileText, Image, File } from 'lucide-react'

interface FileUploadProps {
  onFilesChange: (files: File[]) => void
  maxFiles?: number
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
}

export function FileUpload({ 
  onFilesChange, 
  maxFiles = 3, 
  maxSize = 10, 
  acceptedTypes = [
    'image/*', // 모든 이미지 파일
    'application/pdf', // PDF
    'application/msword', // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.hancom.hwp', // HWP
    'application/haansofthwp', // HWP (다른 MIME 타입)
    '.hwp', '.hwpx', // HWP 확장자
    '.doc', '.docx', // Word 확장자
    '.pdf', // PDF 확장자
    '.txt', '.rtf', // 텍스트 파일
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico' // 이미지 확장자
  ],
  className = '' 
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>('')

  const validateFile = (file: File): boolean => {
    // 파일 크기 검증
    if (file.size > maxSize * 1024 * 1024) {
      setError(`파일 크기는 ${maxSize}MB 이하여야 합니다.`)
      return false
    }

    // 파일 타입 검증
    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase())
      } else if (type.includes('/*')) {
        const mainType = type.split('/')[0]
        return file.type.startsWith(mainType)
      } else {
        return file.type === type
      }
    })

    if (!isValidType) {
      setError('지원하지 않는 파일 형식입니다.')
      return false
    }

    return true
  }

  const handleFiles = useCallback((newFiles: FileList) => {
    setError('')
    const validFiles: File[] = []
    
    Array.from(newFiles).forEach(file => {
      if (files.length + validFiles.length >= maxFiles) {
        setError(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`)
        return
      }
      
      if (validateFile(file)) {
        validFiles.push(file)
      }
    })

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles]
      setFiles(updatedFiles)
      onFilesChange(updatedFiles)
    }
  }, [files, maxFiles, maxSize, acceptedTypes, onFilesChange])

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
    setError('')
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const getFileIcon = (file: File) => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    
    // 이미지 파일
    if (fileType.startsWith('image/') || 
        fileName.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|ico)$/)) {
      return <Image className="w-4 h-4 text-blue-500" />
    }
    
    // PDF 파일
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return <FileText className="w-4 h-4 text-red-500" />
    }
    
    // Word 문서
    if (fileType.includes('msword') || 
        fileType.includes('wordprocessingml') ||
        fileName.match(/\.(doc|docx)$/)) {
      return <FileText className="w-4 h-4 text-blue-600" />
    }
    
    // HWP 파일
    if (fileType.includes('hwp') || fileName.match(/\.(hwp|hwpx)$/)) {
      return <FileText className="w-4 h-4 text-orange-500" />
    }
    
    // 텍스트 파일
    if (fileType.startsWith('text/') || fileName.match(/\.(txt|rtf)$/)) {
      return <FileText className="w-4 h-4 text-green-500" />
    }
    
    // 기타 파일
    return <File className="w-4 h-4 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={className}>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-1">
          <span className="font-medium text-blue-600 hover:underline cursor-pointer">
            파일을 선택하거나
          </span>{' '}
          드래그해서 업로드하세요
        </p>
        <p className="text-xs text-gray-500">
          PDF, DOC, DOCX, HWP, 이미지 파일 등 (최대 {maxSize}MB, {maxFiles}개까지)
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-medium text-gray-700">첨부된 파일:</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
              <div className="flex items-center space-x-2">
                {getFileIcon(file)}
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 