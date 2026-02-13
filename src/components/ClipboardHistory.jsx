import React from 'react'
import ClipboardItem from './ClipboardItem'
import { useLanguage } from '../utils/i18n'
import '../scss/ClipboardHistory.scss'

const ClipboardHistory = ({ items, onDelete, onCopy, onEdit, viewMode, searchQuery }) => {
  const { t } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="clipboard-history">
        <div className="empty-state">
          <div className="empty-icon">
            {searchQuery ? 'SEARCH' : 'EMPTY'}
          </div>
          <h3 className="empty-title">
            {searchQuery ? t('empty.titleSearch') : t('empty.title')}
          </h3>
          <p className="empty-description">
            {searchQuery 
              ? t('empty.descriptionSearch', { query: searchQuery })
              : t('empty.description')
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="clipboard-history">
      <div className="container">
        <div className={`items-container ${viewMode}`}>
          {items.map((item, index) => (
            <ClipboardItem
              key={item.id}
              item={item}
              index={index}
              onDelete={onDelete}
              onCopy={onCopy}
              onEdit={onEdit}
              viewMode={viewMode}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ClipboardHistory