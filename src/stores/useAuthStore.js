import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabaseClient'

export const useAuthStore = defineStore('auth', () => {

    const user = ref(null)
    const session = ref(null)
    const loading = ref(true)

    const isAuthenticated = computed(() => user.value !== null)

    async function initAuth() {
        loading.value = true
        const { data: { session: currentSession } } = await supabase.auth.getSession()

        session.value = currentSession
        user.value = currentSession?.user ?? null

        supabase.auth.onAuthStateChange((_event, newSession) => {
            session.value = newSession
            user.value = newSession?.user ?? null
        })

        loading.value = false
    }

    async function signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) throw error
        return data
    }

    async function signUp(email, password, name) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name: name
                }
            }
        })
        if (error) throw error
        return data
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        user.value = null
        session.value = null
    }

    return {
        user,
        session,
        loading,
        isAuthenticated,
        initAuth,
        signIn,
        signUp,
        signOut
    }
})