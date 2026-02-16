import { useEffect, useState, useCallback } from "react"
import { Header } from "@/layout/header"
import { Footer } from "@/components/Footer"
import ReviewCard from "@/components/ReviewCard"
import ReviewForm from "@/components/ReviewForm"
import StarRating from "@/components/StarRating"
import LikeButton from "@/components/LikeButton"
import TrackSearchBar from "@/components/TrackSearchBar"
import type { SpotifyData, Track } from "@/App"
import type { DbReviewWithProfile } from "@/lib/supabase"
import {
  upsertProfile,
  fetchRecentReviews,
  fetchReviewsByUser,
  fetchReviewsForTrack,
  fetchUserLikes,
  fetchLikeCountsForTracks,
  createOrUpdateReview,
  deleteReview,
  toggleLike,
} from "@/lib/supabase-api"

interface ReviewsPageProps {
  onLogout: () => void
  spotifyData: SpotifyData
  token: string
}

type Tab = "feed" | "my-tracks" | "search"

export default function ReviewsPage({
  onLogout,
  spotifyData,
  token,
}: ReviewsPageProps) {
  const { user } = spotifyData
  const userId = (user as unknown as { id: string })?.id ?? ""

  const [tab, setTab] = useState<Tab>("feed")
  const [feed, setFeed] = useState<DbReviewWithProfile[]>([])
  const [userReviews, setUserReviews] = useState<Map<string, DbReviewWithProfile>>(new Map())
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())
  const [likeCounts, setLikeCounts] = useState<Map<string, number>>(new Map())
  const [loading, setLoading] = useState(true)

  // Modal state
  const [modalTrack, setModalTrack] = useState<Track | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Search tab state
  const [selectedSearchTrack, setSelectedSearchTrack] = useState<Track | null>(null)
  const [searchTrackReviews, setSearchTrackReviews] = useState<DbReviewWithProfile[]>([])

  // Load initial data
  const loadData = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      await upsertProfile(user as unknown as SpotifyData["user"] & { id: string })
      const [feedData, myReviews, likes] = await Promise.all([
        fetchRecentReviews(50),
        fetchReviewsByUser(userId),
        fetchUserLikes(userId),
      ])

      setFeed(feedData)
      const reviewMap = new Map<string, DbReviewWithProfile>()
      myReviews.forEach((r) => reviewMap.set(r.track_id, r))
      setUserReviews(reviewMap)
      setLikedTracks(likes)

      // Like counts for all visible tracks
      const allTrackIds = [
        ...feedData.map((r) => r.track_id),
        ...spotifyData.topTracks.map((t) => t.id),
      ]
      const uniqueIds = [...new Set(allTrackIds)]
      if (uniqueIds.length > 0) {
        const counts = await fetchLikeCountsForTracks(uniqueIds)
        setLikeCounts(counts)
      }
    } catch (err) {
      console.error("loadData error:", err)
    } finally {
      setLoading(false)
    }
  }, [userId, user, spotifyData.topTracks])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Submit review
  const handleSubmitReview = async (track: Track, rating: number, text: string) => {
    if (!userId) return
    setSubmitting(true)
    const { error } = await createOrUpdateReview({
      spotify_user_id: userId,
      track_id: track.id,
      track_name: track.name,
      track_artist: track.artists.map((a) => a.name).join(", "),
      track_album: track.album.name,
      track_album_image: track.album.images?.[0]?.url ?? null,
      rating,
      review_text: text || null,
    })
    setSubmitting(false)
    if (!error) {
      setModalTrack(null)
      await loadData()
      // Reload search track reviews if applicable
      if (selectedSearchTrack && selectedSearchTrack.id === track.id) {
        const reviews = await fetchReviewsForTrack(track.id)
        setSearchTrackReviews(reviews)
      }
    }
  }

  // Delete review
  const handleDelete = async (reviewId: string) => {
    await deleteReview(reviewId)
    await loadData()
    if (selectedSearchTrack) {
      const reviews = await fetchReviewsForTrack(selectedSearchTrack.id)
      setSearchTrackReviews(reviews)
    }
  }

  // Toggle like
  const handleToggleLike = async (trackId: string) => {
    if (!userId) return
    const { liked } = await toggleLike(userId, trackId)
    setLikedTracks((prev) => {
      const next = new Set(prev)
      if (liked) next.add(trackId)
      else next.delete(trackId)
      return next
    })
    setLikeCounts((prev) => {
      const next = new Map(prev)
      const current = next.get(trackId) ?? 0
      next.set(trackId, liked ? current + 1 : Math.max(0, current - 1))
      return next
    })
  }

  // Search: select track
  const handleSearchSelect = async (track: Track) => {
    setSelectedSearchTrack(track)
    const reviews = await fetchReviewsForTrack(track.id)
    setSearchTrackReviews(reviews)
    // fetch like count for this track
    const counts = await fetchLikeCountsForTracks([track.id])
    setLikeCounts((prev) => {
      const next = new Map(prev)
      counts.forEach((v, k) => next.set(k, v))
      return next
    })
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "feed", label: "Fil d'avis" },
    { key: "my-tracks", label: "Mes titres" },
    { key: "search", label: "Rechercher" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        user={{
          name: user?.display_name || "Utilisateur",
          email: user?.email || "",
          image: user?.images?.[0]?.url,
        }}
        onLogout={onLogout}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Avis & Notes</h1>
          <p className="text-zinc-400">
            Note, commente et decouvre les avis de la communaute
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key
                  ? "bg-green-500 text-black"
                  : "bg-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Feed tab */}
            {tab === "feed" && (
              <div className="space-y-4">
                {feed.length === 0 ? (
                  <div className="text-center py-16 text-zinc-500">
                    <p className="text-lg mb-1">Aucun avis pour le moment.</p>
                    <p className="text-sm">
                      Sois le premier a noter un titre !
                    </p>
                  </div>
                ) : (
                  feed.map((review) => (
                    <div key={review.id}>
                      <ReviewCard
                        review={review}
                        currentUserId={userId}
                        onDelete={handleDelete}
                      />
                      <div className="mt-2 ml-6">
                        <LikeButton
                          liked={likedTracks.has(review.track_id)}
                          count={likeCounts.get(review.track_id) ?? 0}
                          onToggle={() => handleToggleLike(review.track_id)}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* My tracks tab */}
            {tab === "my-tracks" && (
              <div className="space-y-2">
                {spotifyData.topTracks.length === 0 ? (
                  <p className="text-center py-16 text-zinc-500">
                    Aucun top track disponible.
                  </p>
                ) : (
                  spotifyData.topTracks.map((track, i) => {
                    const existing = userReviews.get(track.id)
                    return (
                      <div
                        key={track.id}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-900 transition-colors"
                      >
                        <span className="text-zinc-500 text-sm w-6 text-right flex-shrink-0">
                          {i + 1}
                        </span>
                        {track.album.images?.[0]?.url && (
                          <img
                            src={track.album.images[0].url}
                            alt={track.album.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-sm font-medium truncate">
                            {track.name}
                          </p>
                          <p className="text-zinc-400 text-xs truncate">
                            {track.artists.map((a) => a.name).join(", ")}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <LikeButton
                            liked={likedTracks.has(track.id)}
                            count={likeCounts.get(track.id) ?? 0}
                            onToggle={() => handleToggleLike(track.id)}
                          />
                          {existing ? (
                            <div className="flex items-center gap-2">
                              <StarRating value={existing.rating} size={14} />
                              <button
                                onClick={() => setModalTrack(track)}
                                className="text-xs text-zinc-500 hover:text-green-400 transition-colors"
                              >
                                Modifier
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setModalTrack(track)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-green-500 hover:text-black transition-colors"
                            >
                              Noter
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {/* Search tab */}
            {tab === "search" && (
              <div className="space-y-6">
                <TrackSearchBar token={token} onSelectTrack={handleSearchSelect} />

                {selectedSearchTrack && (
                  <div className="space-y-6">
                    {/* Selected track info */}
                    <div className="flex gap-4 items-center p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                      {selectedSearchTrack.album.images?.[0]?.url && (
                        <img
                          src={selectedSearchTrack.album.images[0].url}
                          alt={selectedSearchTrack.album.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-white font-semibold truncate">
                          {selectedSearchTrack.name}
                        </p>
                        <p className="text-zinc-400 text-sm truncate">
                          {selectedSearchTrack.artists
                            .map((a) => a.name)
                            .join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <LikeButton
                          liked={likedTracks.has(selectedSearchTrack.id)}
                          count={
                            likeCounts.get(selectedSearchTrack.id) ?? 0
                          }
                          onToggle={() =>
                            handleToggleLike(selectedSearchTrack.id)
                          }
                        />
                        <button
                          onClick={() => setModalTrack(selectedSearchTrack)}
                          className="text-sm px-4 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition-colors"
                        >
                          {userReviews.has(selectedSearchTrack.id)
                            ? "Modifier mon avis"
                            : "Noter ce titre"}
                        </button>
                      </div>
                    </div>

                    {/* Reviews for this track */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Avis ({searchTrackReviews.length})
                      </h3>
                      {searchTrackReviews.length === 0 ? (
                        <p className="text-zinc-500 text-sm">
                          Aucun avis pour ce titre. Sois le premier !
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {searchTrackReviews.map((review) => (
                            <ReviewCard
                              key={review.id}
                              review={review}
                              currentUserId={userId}
                              onDelete={handleDelete}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />

      {/* Modal overlay */}
      {modalTrack && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalTrack(null)
          }}
        >
          <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 max-w-lg w-full">
            <ReviewForm
              track={modalTrack}
              initialRating={userReviews.get(modalTrack.id)?.rating ?? 0}
              initialText={userReviews.get(modalTrack.id)?.review_text ?? ""}
              submitting={submitting}
              onSubmit={(rating, text) =>
                handleSubmitReview(modalTrack, rating, text)
              }
              onCancel={() => setModalTrack(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
