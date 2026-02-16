import { supabase, type DbReviewWithProfile } from "./supabase"
import type { SpotifyUser } from "@/App"

export async function upsertProfile(user: SpotifyUser) {
  const { error } = await supabase.from("profiles").upsert(
    {
      spotify_user_id: user.id,
      display_name: user.display_name,
      avatar_url: user.images?.[0]?.url ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "spotify_user_id" }
  )
  if (error) console.error("upsertProfile error:", error)
}

export async function fetchRecentReviews(limit = 50): Promise<DbReviewWithProfile[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(display_name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(limit)
  if (error) {
    console.error("fetchRecentReviews error:", error)
    return []
  }
  return (data ?? []) as DbReviewWithProfile[]
}

export async function fetchReviewsForTrack(trackId: string): Promise<DbReviewWithProfile[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(display_name, avatar_url)")
    .eq("track_id", trackId)
    .order("created_at", { ascending: false })
  if (error) {
    console.error("fetchReviewsForTrack error:", error)
    return []
  }
  return (data ?? []) as DbReviewWithProfile[]
}

export async function fetchReviewsByUser(userId: string): Promise<DbReviewWithProfile[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(display_name, avatar_url)")
    .eq("spotify_user_id", userId)
    .order("created_at", { ascending: false })
  if (error) {
    console.error("fetchReviewsByUser error:", error)
    return []
  }
  return (data ?? []) as DbReviewWithProfile[]
}

export async function createOrUpdateReview(review: {
  spotify_user_id: string
  track_id: string
  track_name: string
  track_artist: string
  track_album: string
  track_album_image: string | null
  rating: number
  review_text: string | null
}) {
  const { error } = await supabase.from("reviews").upsert(
    {
      ...review,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "spotify_user_id,track_id" }
  )
  if (error) console.error("createOrUpdateReview error:", error)
  return { error }
}

export async function deleteReview(reviewId: string) {
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId)
  if (error) console.error("deleteReview error:", error)
  return { error }
}

export async function toggleLike(
  userId: string,
  trackId: string
): Promise<{ liked: boolean }> {
  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("spotify_user_id", userId)
    .eq("track_id", trackId)
    .maybeSingle()

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id)
    return { liked: false }
  } else {
    await supabase
      .from("likes")
      .insert({ spotify_user_id: userId, track_id: trackId })
    return { liked: true }
  }
}

export async function fetchUserLikes(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("likes")
    .select("track_id")
    .eq("spotify_user_id", userId)
  if (error) {
    console.error("fetchUserLikes error:", error)
    return new Set()
  }
  return new Set((data ?? []).map((l) => l.track_id))
}

export async function fetchLikeCountsForTracks(
  trackIds: string[]
): Promise<Map<string, number>> {
  if (trackIds.length === 0) return new Map()
  const { data, error } = await supabase
    .from("likes")
    .select("track_id")
    .in("track_id", trackIds)
  if (error) {
    console.error("fetchLikeCountsForTracks error:", error)
    return new Map()
  }
  const counts = new Map<string, number>()
  for (const like of data ?? []) {
    counts.set(like.track_id, (counts.get(like.track_id) ?? 0) + 1)
  }
  return counts
}
