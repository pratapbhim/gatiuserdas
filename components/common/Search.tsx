'use client'

import { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setQuery, setResults, setIsSearching, setShowSuggestions } from '@/lib/slices/searchSlice'
import Fuse from 'fuse.js'

interface SearchProps {
  placeholder?: string
  data?: any[]
  onSelect?: (item: any) => void
  className?: string
}

export default function Search({ 
  placeholder = "🔍 Search for brands, stores & services…",
  data = [],
  onSelect,
  className = ""
}: SearchProps) {
  const dispatch = useAppDispatch()
  const { query, results, showSuggestions } = useAppSelector(state => state.search)
  const [localQuery, setLocalQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const searchRef = useRef<HTMLDivElement>(null)
  const dataRef = useRef<any[]>(data)
  
  // Update dataRef when data changes (using ref to avoid dependency issues)
  useEffect(() => {
    dataRef.current = data
  }, [data])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(localQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [localQuery])

  // Perform search when debounced query changes
  useEffect(() => {
    const currentData = dataRef.current
    
    if (!debouncedQuery.trim() || !currentData.length) {
      dispatch(setResults([]))
      dispatch(setShowSuggestions(false))
      return
    }

    dispatch(setIsSearching(true))
    dispatch(setShowSuggestions(true))

    // Configure Fuse.js for fuzzy search
    const fuse = new Fuse(currentData, {
      keys: ['name', 'cuisine', 'tags', 'description'],
      threshold: 0.3,
      includeScore: true,
      minMatchCharLength: 2,
    })

    const searchResults = fuse.search(debouncedQuery)
    
    // Sort results: exact matches first, then by score
    const sortedResults = searchResults
      .map(result => ({
        ...result.item,
        score: result.score || 0,
        isExactMatch: result.item.name?.toLowerCase() === debouncedQuery.toLowerCase(),
      }))
      .sort((a, b) => {
        if (a.isExactMatch && !b.isExactMatch) return -1
        if (!a.isExactMatch && b.isExactMatch) return 1
        return (a.score || 0) - (b.score || 0)
      })

    dispatch(setResults(sortedResults.slice(0, 10)))
    dispatch(setIsSearching(false))
  }, [debouncedQuery, dispatch])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        dispatch(setShowSuggestions(false))
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalQuery(value)
    dispatch(setQuery(value))
  }

  const handleSelect = (item: any) => {
    dispatch(setQuery(item.name || ''))
    dispatch(setShowSuggestions(false))
    setLocalQuery(item.name || '')
    if (onSelect) {
      onSelect(item)
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <input
        type="text"
        value={localQuery}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full border-none outline-none px-[26px] py-[22px] text-base bg-transparent text-text placeholder:text-[rgba(30,30,47,0.55)]"
        onFocus={() => {
          if (results.length > 0) {
            dispatch(setShowSuggestions(true))
          }
        }}
      />

      {showSuggestions && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {results.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className="px-6 py-4 hover:bg-purple-light cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-text">{item.name}</div>
                  {item.cuisine && (
                    <div className="text-sm text-text-light">{item.cuisine}</div>
                  )}
                  {item.rating && (
                    <div className="text-sm text-text-light mt-1">
                      ⭐ {item.rating} ({item.totalRatings}+ ratings)
                    </div>
                  )}
                </div>
                {item.isExactMatch && (
                  <span className="px-2 py-1 bg-mint-light text-purple text-xs font-bold rounded-full">
                    Exact Match
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showSuggestions && debouncedQuery && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 p-6 text-center">
          <div className="text-text-light">No results found for "{debouncedQuery}"</div>
        </div>
      )}
    </div>
  )
}

