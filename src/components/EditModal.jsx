import React, { useState, useEffect } from 'react'
import '../scss/EditModal.scss'

const EditModal = ({ item, onSave, onCancel }) => {
  const [content, setContent] = useState(item.content)

  useEffect(() => {
    setContent(item.content)
  }, [item])

  const handleSave = () => {
    onSave(item.id, content)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel()
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave()
    }
  }

  return (
    <div className="edit-modal-overlay" onClick={onCancel}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Edit Content</h3>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>
        
        <div className="modal-body">
          <textarea
            className="edit-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={item.type === 'code' ? 20 : 10}
          />
        </div>
        
        <div className="modal-footer">
          <div className="shortcut-hint">
            <kbd>Ctrl+Enter</kbd> to save • <kbd>Esc</kbd> to cancel
          </div>
          <div className="modal-actions">
            <button className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditModal