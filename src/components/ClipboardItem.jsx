// ClipboardItem.jsx - Fixed with improved copy handling for images
import React, { useState, useEffect } from 'react'
import { FiImage, FiCode, FiType, FiCopy, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi'
import { useLanguage } from '../utils/i18n'
import '../scss/ClipboardItem.scss'

const ClipboardItem = ({ item, index, onDelete, onCopy, onEdit, viewMode }) => {
  const { t, formatRelativeTime } = useLanguage();
  const [copied, setCopied] = useState(false)
  const [themeTypeColors, setThemeTypeColors] = useState({})

  // Listen for theme changes to update type colors
  useEffect(() => {
    const updateTypeColors = () => {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)
      
      setThemeTypeColors({
        text: {
          background: computedStyle.getPropertyValue('--type-text-bg')?.trim() || '#FF1A00',
          color: computedStyle.getPropertyValue('--type-text-color')?.trim() || '#FFFFFF'
        },
        code: {
          background: computedStyle.getPropertyValue('--type-code-bg')?.trim() || '#8b5cf6',
          color: computedStyle.getPropertyValue('--type-code-color')?.trim() || '#FFFFFF'
        },
        image: {
          background: computedStyle.getPropertyValue('--type-image-bg')?.trim() || '#22c55e',
          color: computedStyle.getPropertyValue('--type-image-color')?.trim() || '#FFFFFF'
        }
      })
    }

    // Initial load
    updateTypeColors()

    // Listen for theme changes
    const handleThemeChange = () => {
      setTimeout(updateTypeColors, 100) // Small delay to ensure CSS is applied
    }

    window.addEventListener('themeChanged', handleThemeChange)
    window.addEventListener('cardCustomizationChanged', handleThemeChange)

    // Also listen for CSS variable changes using MutationObserver
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'data-theme' || 
             mutation.attributeName === 'data-custom-theme')) {
          handleThemeChange()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-custom-theme']
    })

    return () => {
      window.removeEventListener('themeChanged', handleThemeChange)
      window.removeEventListener('cardCustomizationChanged', handleThemeChange)
      observer.disconnect()
    }
  }, [])

  const formatTimestamp = (timestamp) => {
    return formatRelativeTime(timestamp);
  }

  const getTypeConfig = (type) => {
    // Get theme-specific colors if available, otherwise use defaults
    const themeColors = themeTypeColors[type]
    
    switch (type) {
      case 'image': 
        return { 
          icon: FiImage, 
          label: t('item.image'),
          color: themeColors?.background || '#22c55e',
          textColor: themeColors?.color || '#FFFFFF'
        }
      case 'code': 
        return { 
          icon: FiCode, 
          label: t('item.code'),
          color: themeColors?.background || '#8b5cf6',
          textColor: themeColors?.color || '#FFFFFF'
        }
      case 'text': 
      default:
        return { 
          icon: FiType, 
          label: t('item.text'),
          color: themeColors?.background || '#FF1A00',
          textColor: themeColors?.color || '#FFFFFF'
        }
    }
  }

  // ปรับปรุง handleCopy ให้หยุด clipboard monitoring ชั่วคราว (ใช้จากเวอร์ชัน 2)
  const handleCopy = async () => {
    try {
      console.log('📄 Starting copy operation from UI')
      
      // หยุด clipboard monitoring ชั่วคราว
      if (window.electronAPI && window.electronAPI.clipboard && window.electronAPI.clipboard.stopMonitoring) {
        await window.electronAPI.clipboard.stopMonitoring()
      }
      
      // ทำการ copy
      await onCopy(item.content, item.type)
      setCopied(true)
      
      console.log('✅ Copy operation completed')
      
      // รอ 3 วินาทีแล้วเริ่ม monitoring อีกครั้ง
      setTimeout(async () => {
        if (window.electronAPI && window.electronAPI.clipboard && window.electronAPI.clipboard.startMonitoring) {
          await window.electronAPI.clipboard.startMonitoring()
        }
      }, 3000)
      
      // รีเซ็ต copied state
      setTimeout(() => setCopied(false), 2000)
      
    } catch (error) {
      console.error('❌ Copy operation failed:', error)
      setCopied(false)
      
      // เริ่ม monitoring อีกครั้งในกรณีที่ error
      setTimeout(async () => {
        if (window.electronAPI && window.electronAPI.clipboard && window.electronAPI.clipboard.startMonitoring) {
          await window.electronAPI.clipboard.startMonitoring()
        }
      }, 1000)
    }
  }

  const typeConfig = getTypeConfig(item.type)
  const IconComponent = typeConfig.icon

  const renderContent = () => {
    switch (item.type) {
      case 'image':
        return (
          <div className="image-preview">
            <img src={item.content} alt="Clipboard content" loading="lazy" />
          </div>
        )
      case 'code':
        return (
          <div className="code-preview">
            <pre><code>{viewMode === 'list' ? item.content : item.preview}</code></pre>
          </div>
        )
      default:
        return (
          <div className="text-preview">
            <p>{viewMode === 'list' ? item.content : item.preview}</p>
          </div>
        )
    }
  }

  return (
    <div 
      className={`clipboard-item ${item.type} ${viewMode}`} 
      style={{
        '--type-color': typeConfig.color,
        '--type-text-color': typeConfig.textColor
      }}
      data-type={item.type}
    >
      {viewMode === 'grid' && (
        <div className="item-number">
          {String(index + 1).padStart(2, '0')}
        </div>
      )}
      
      <div className="item-header">
        <div className="type-indicator">
          <div 
            className={`type-icon type-icon-${item.type}`}
            style={{
              backgroundColor: typeConfig.color,
              color: typeConfig.textColor
            }}
          >
            <IconComponent size={14} />
          </div>
          <div className="type-info">
            <span className="type-label">{typeConfig.label}</span>
            <span className="timestamp">{formatTimestamp(item.timestamp)}</span>
          </div>
        </div>
      </div>
      
      <div className="item-content">
        {renderContent()}
      </div>
      
      <div className="item-actions">
        <button 
          className={`action-btn copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title={t('item.copy')}
          disabled={copied} // ป้องกันการกด copy หลายครั้งติดกัน
        >
          {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
          {viewMode === 'grid' && (
            <span className="btn-label">{copied ? t('item.copied') : t('item.copy')}</span>
          )}
        </button>
        
        {item.type !== 'image' && (
          <button 
            className="action-btn edit-btn"
            onClick={() => onEdit(item)}
            title={t('item.edit')}
          >
            <FiEdit2 size={12} />
            {viewMode === 'grid' && (
              <span className="btn-label">{t('item.edit')}</span>
            )}
          </button>
        )}
        
        <button 
          className="action-btn delete-btn"
          onClick={() => onDelete(item.id)}
          title={t('item.delete')}
        >
          <FiTrash2 size={12} />
          {viewMode === 'grid' && (
            <span className="btn-label">{t('item.delete')}</span>
          )}
        </button>
      </div>
    </div>
  )
}

export default ClipboardItem