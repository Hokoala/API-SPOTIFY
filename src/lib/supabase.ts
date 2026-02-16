import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface DbProfile {
  spotify_user_id: string
  display_name: string
  avatar_url: string | null
  updated_at: string
}

export interface DbReview {
  id: string
  spotify_user_id: string
  track_id: string
  track_name: string
  track_artist: string
  track_album: string
  track_album_image: string | null
  rating: number
  review_text: string | null
  created_at: string
  updated_at: string
}

export interface DbReviewWithProfile extends DbReview {
  profiles: Pick<DbProfile, "display_name" | "avatar_url">
}

export interface DbLike {
  id: string
  spotify_user_id: string
  track_id: string
  created_at: string
}
