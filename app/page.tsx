'use client'

import { useState } from 'react'
import BookmarkList from '@/components/BookmarkList'
import AddBookmarkForm from '@/components/AddBookmarkForm'
import AuthButton from '@/components/AuthButton'

export default function HomePage() {
    const [lastUpdated, setLastUpdated] = useState(Date.now())

    const handleBookmarkAdded = () => {
        setLastUpdated(Date.now())
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Smart Bookmarks
                        </h1>
                        <p className="text-white/70 mt-2">Manage your bookmarks with real-time sync</p>
                    </div>
                    <AuthButton />
                </div>

                {/* Add Bookmark Form */}
                <AddBookmarkForm onBookmarkAdded={handleBookmarkAdded} />

                {/* Bookmarks List */}
                <BookmarkList lastUpdated={lastUpdated} />
            </div>
        </div>
    )
}
