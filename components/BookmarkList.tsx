'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Bookmark } from '@/lib/types'

interface BookmarkListProps {
    lastUpdated?: number
}

export default function BookmarkList({ lastUpdated }: BookmarkListProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [supabase] = useState(() => createClient())

    const fetchBookmarks = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setError('You must be logged in')
                return
            }

            const { data, error: fetchError } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (fetchError) throw fetchError

            setBookmarks(data || [])
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bookmarks')
        } finally {
            setLoading(false)
        }
    }

    const deleteBookmark = async (id: string) => {
        try {
            const { error: deleteError } = await supabase
                .from('bookmarks')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            // Optimistic update
            setBookmarks(bookmarks.filter((b) => b.id !== id))
        } catch (err: any) {
            setError(err.message || 'Failed to delete bookmark')
        }
    }

    useEffect(() => {
        fetchBookmarks()

        // Set up real-time subscription
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                },
                (payload) => {
                    console.log('Change received!', payload)
                    fetchBookmarks()
                }
            )
            .subscribe((status) => {
                console.log('Realtime subscription status:', status)
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [lastUpdated])

    if (loading) {
        return (
            <div className="glass-card p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="text-white/70 mt-4">Loading bookmarks...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="glass-card p-6 bg-red-500/20 border-red-500/50">
                <p className="text-red-200">{error}</p>
            </div>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <div className="glass-card p-8 text-center">
                <svg
                    className="w-16 h-16 mx-auto mb-4 text-white/30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h3>
                <p className="text-white/70">Add your first bookmark to get started!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white mb-4">
                Your Bookmarks ({bookmarks.length})
            </h2>

            <div className="grid gap-4">
                {bookmarks.map((bookmark) => (
                    <div
                        key={bookmark.id}
                        className="glass-card p-5 hover:bg-white/15 transition-all duration-200 group"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-lg font-medium text-white hover:text-purple-300 transition-colors block truncate"
                                >
                                    {bookmark.title}
                                </a>
                                <a
                                    href={bookmark.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-white/60 hover:text-white/80 transition-colors block truncate mt-1"
                                >
                                    {bookmark.url}
                                </a>
                                <p className="text-xs text-white/40 mt-2">
                                    Added {new Date(bookmark.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <button
                                onClick={() => deleteBookmark(bookmark.id)}
                                className="btn-danger opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Delete bookmark"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
