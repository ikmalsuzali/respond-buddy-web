import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function useSupabaseAuth() {
  const user = ref(null)
  const session = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const signInWithGoogle = async () => {
    isLoading.value = true
    console.log(window.location.origin)

    const response = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: window.location.origin + '/auth-callback',
      },
    })

    // if (user.value && !error.value) {
    //   // New user has signed up, store extra data
    //   // await storePostOAuthData(user.value)
    // }
  }

  // const storePostOAuthData = async (user) => {
  //   // Here, you can extract any additional data you received from Google or define some defaults.
  //   // For this example, let's assume you get display_name and avatar_url.

  //   const { data, error } = await supabase.from('profiles').insert([
  //     {
  //       user_id: user.id,
  //       display_name: user.user_metadata.full_name, // Assume this is the field you want
  //       avatar_url: user.user_metadata.avatar_url, // And this too
  //       // ... any other data you wish to store
  //     },
  //   ])

  //   if (error) {
  //     console.error('Error storing extra user data:', error)
  //   }
  // }

  return {
    signInWithGoogle,
    isLoading,
  }
}
