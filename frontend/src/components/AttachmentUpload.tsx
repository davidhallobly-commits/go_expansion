import { useState } from 'react'
import { supabase } from '../services/supabase'
import type { Attachment } from '../types/database'
import { getAttachments, deleteAttachment } from '../services/database'

interface AttachmentUploadProps {
  entityType: 'deal' | 'property'
  entityId: string
  entityName: string
}

export default function AttachmentUpload({ entityType, entityId }: AttachmentUploadProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const loadAttachments = async () => {
    try {
      setLoading(true)
      const data = await getAttachments(
        entityType === 'deal' ? entityId : undefined,
        entityType === 'property' ? entityId : undefined
      )
      setAttachments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attachments')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    try {
      setUploading(true)
      setError(null)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError(`File ${file.name} is too large (max 10MB)`)
          continue
        }

        // Upload to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`
        const filePath = `${entityType}s/${entityId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        // Create attachment record in database
        const { error: dbError } = await supabase
          .from('attachments')
          .insert({
            file_name: file.name,
            file_path: filePath,
            file_type: file.type,
            size: file.size,
            [entityType === 'deal' ? 'deal_id' : 'property_id']: entityId,
            uploaded_by: (await supabase.auth.getUser()).data.user?.id,
          })

        if (dbError) throw dbError
      }

      // Reload attachments
      await loadAttachments()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (attachmentId: string, filePath: string) => {
    if (!confirm('Delete this attachment?')) return

    try {
      // Delete from storage
      await supabase.storage.from('attachments').remove([filePath])

      // Delete from database
      await deleteAttachment(attachmentId)

      setAttachments(attachments.filter(a => a.id !== attachmentId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete attachment')
    }
  }

  const handleDownload = async (filePath: string, _fileName: string) => {
    try {
      const { data } = await supabase.storage
        .from('attachments')
        .getPublicUrl(filePath)

      if (data.publicUrl) {
        window.open(data.publicUrl, '_blank')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download file')
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️'
    if (fileType.includes('pdf')) return '📄'
    if (fileType.includes('word') || fileType.includes('document')) return '📝'
    if (fileType.includes('sheet') || fileType.includes('excel')) return '📊'
    return '📎'
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {/* Header */}
      <button
        onClick={() => {
          if (!isExpanded) loadAttachments()
          setIsExpanded(!isExpanded)
        }}
        className="flex items-center justify-between w-full"
      >
        <h3 className="text-sm font-bold text-gray-900">📎 Attachments</h3>
        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
          {attachments.length}
        </span>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Upload Area */}
          <div
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
              if (e.dataTransfer.files) {
                handleFileUpload(e.dataTransfer.files)
              }
            }}
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(e.target.files)
                  e.target.value = '' // Reset input
                }
              }}
              disabled={uploading}
              className="hidden"
              id={`file-input-${entityId}`}
            />
            <label htmlFor={`file-input-${entityId}`} className="cursor-pointer">
              <p className="text-sm text-gray-600 mb-2">
                {uploading ? 'Uploading...' : 'Drag and drop files here or click to browse'}
              </p>
              <p className="text-xs text-gray-500">Max 10MB per file</p>
            </label>
          </div>

          {/* Attachments List */}
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-xs text-gray-600 mt-2">Loading...</p>
            </div>
          ) : attachments.length === 0 ? (
            <p className="text-xs text-gray-600 text-center py-2">No attachments yet</p>
          ) : (
            <div className="space-y-2">
              {attachments.map(attachment => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200 text-xs"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-lg flex-shrink-0">
                      {getFileIcon(attachment.file_type)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">
                        {attachment.file_name}
                      </p>
                      <p className="text-gray-600">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 ml-2">
                    <button
                      onClick={() =>
                        handleDownload(attachment.file_path, attachment.file_name)
                      }
                      className="px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                      title="Download"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(attachment.id, attachment.file_path)
                      }
                      className="px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
