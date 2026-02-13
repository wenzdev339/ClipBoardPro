// Header.jsx
import React, { useState, useEffect, useRef } from 'react'
import { IoFilterOutline, IoGridOutline, IoListOutline, IoCloseOutline } from 'react-icons/io5'
import { useLanguage } from '../utils/i18n'
import '../scss/Header.scss'

const Header = ({
  filter,
  setFilter,
  clearHistory,
  totalItems,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  onOpenSettings
}) => {
  const { t } = useLanguage(); // Use translation hook
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState(false)
  const filterRef = useRef(null)

  const filterOptions = [
    { value: 'all', label: t('filter.all'), count: totalItems },
    { value: 'text', label: t('filter.text'), count: 0 },
    { value: 'image', label: t('filter.images'), count: 0 },
    { value: 'code', label: t('filter.code'), count: 0 }
  ]

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ฟังก์ชันสลับ View Mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">

          {/* Left */}
          <div className="header-left">
            <div className="brand">
              <div className="brand-text">{t('app.title')}</div>
            </div>
            <div className="stats">
              <span className="stats-count">{totalItems}</span>
              <span>{t('header.items')}</span>
            </div>
          </div>

          {/* Center */}
          <div className="header-center">
            <div className="search-container">
              <div className="search-icon">⌕</div>
              <input
                type="text"
                className="search-input"
                placeholder={t('header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              {searchQuery && (
                <button
                  className="search-clear"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="header-right">
            <div className="header-actions">

              {/* Filter */}
              <div className="filter-dropdown" ref={filterRef}>
                <button
                  className="filter-btn"
                  onClick={() => setShowFilterDropdown((prev) => !prev)}
                  title={t('header.filter')}
                  aria-label={t('header.filter')}
                >
                  <IoFilterOutline className="filter-icon" />
                </button>
                {showFilterDropdown && (
                  <div className="dropdown-menu">
                    {filterOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`dropdown-item ${filter === option.value ? 'active' : ''}`}
                        onClick={() => {
                          setFilter(option.value)
                          setShowFilterDropdown(false)
                        }}
                      >
                        {option.label} ({option.count})
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ปุ่มสลับ Grid/List */}
              <button
                className="view-toggle-single"
                onClick={toggleViewMode}
                title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
                aria-label="Toggle View Mode"
              >
                {viewMode === 'grid' ? (
                  <IoGridOutline />
                ) : (
                  <IoListOutline />
                )}
              </button>

              <button
                className="clear-btn"
                onClick={clearHistory}
                disabled={totalItems === 0}
                title={t('header.clearAll')}
                aria-label={t('header.clearAll')}
              >
                <IoCloseOutline />
              </button>

              <button
                className="settings-btn"
                onClick={onOpenSettings}
                title={t('header.settings')}
                aria-label={t('header.settings')}
              >
                ⚙
              </button>

            </div>
          </div>

        </div>
      </div>
    </header>
  )
}

export default Header