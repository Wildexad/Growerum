import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabaseClient'

export const useDiagnosisStore = defineStore('diagnosis', () => {
    // Состояние
    const diagnoses = ref([])
    const loading = ref(false)
    const error = ref(null)
    const currentDiagnosis = ref(null)

    // Вычисляемые свойства
    const totalDiagnoses = computed(() => diagnoses.value.length)
    const averageConfidence = computed(() => {
        if (diagnoses.value.length === 0) return 0
        const sum = diagnoses.value.reduce((acc, d) => acc + d.confidence, 0)
        return Math.round(sum / diagnoses.value.length)
    })

    // Загрузить историю диагностик из Supabase
    async function loadDiagnosisHistory() {
        loading.value = true
        error.value = null

        try {
            // Пытаемся загрузить из Supabase с таймаутом
            const loadPromise = supabase
                .from('diagnosis_history')
                .select('*')
                .order('created_at', { ascending: false })

            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Таймаут загрузки')), 5000)
            )

            const { data, error: fetchError } = await Promise.race([loadPromise, timeoutPromise])

            if (fetchError) throw fetchError

            diagnoses.value = data || []
            
            // Сохраняем в localStorage как кэш
            localStorage.setItem('diagnosisHistory', JSON.stringify(data))
            
            return data
        } catch (err) {
            error.value = err.message
            console.warn('Ошибка загрузки из Supabase:', err.message)
            
            // Загружаем из localStorage как запасной вариант
            const cached = localStorage.getItem('diagnosisHistory')
            if (cached) {
                diagnoses.value = JSON.parse(cached)
            } else {
                diagnoses.value = []
            }
        } finally {
            loading.value = false
        }
    }

    // Сохранить диагностику в Supabase
    async function saveDiagnosis(diagnosisData) {
        loading.value = true
        error.value = null

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Пользователь не авторизован')

            // Пытаемся сохранить в Supabase с таймаутом
            const savePromise = supabase
                .from('diagnosis_history')
                .insert({
                    user_id: user.id,
                    disease_name: diagnosisData.disease,
                    confidence: diagnosisData.confidence,
                    description: diagnosisData.description,
                    recommendations: diagnosisData.recommendations,
                    explanation: diagnosisData.explanation,
                    answers: diagnosisData.answers
                })
                .select()
                .single()

            // Добавляем таймаут 5 секунд
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Таймаут сохранения')), 5000)
            )

            const { data, error: saveError } = await Promise.race([savePromise, timeoutPromise])

            if (saveError) throw saveError

            // Добавляем в локальный список
            diagnoses.value.unshift(data)
            currentDiagnosis.value = data

            // Обновляем localStorage как бэкап
            localStorage.setItem('diagnosisHistory', JSON.stringify(diagnoses.value))

            // Обновляем статистику пользователя
            await updateUserStats()

            return data
        } catch (err) {
            // Если Supabase недоступен, сохраняем в localStorage
            console.warn('Supabase недоступен, сохраняем в localStorage:', err.message)
            
            const { data: { user } } = await supabase.auth.getUser()
            const localEntry = {
                id: Date.now().toString(),
                user_id: user?.id || 'unknown',
                disease_name: diagnosisData.disease,
                confidence: diagnosisData.confidence,
                description: diagnosisData.description,
                recommendations: diagnosisData.recommendations,
                explanation: diagnosisData.explanation,
                answers: diagnosisData.answers,
                created_at: new Date().toISOString()
            }
            
            diagnoses.value.unshift(localEntry)
            localStorage.setItem('diagnosisHistory', JSON.stringify(diagnoses.value))
            
            error.value = 'Сохранено локально. Таблицы Supabase ещё не созданы.'
            return localEntry
        } finally {
            loading.value = false
        }
    }

    // Удалить диагностику
    async function deleteDiagnosis(id) {
        loading.value = true
        error.value = null

        try {
            // Пытаемся удалить из Supabase с таймаутом
            const deletePromise = supabase
                .from('diagnosis_history')
                .delete()
                .eq('id', id)

            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Таймаут удаления')), 5000)
            )

            const { error: deleteError } = await Promise.race([deletePromise, timeoutPromise])

            if (deleteError) throw deleteError

            // Удаляем из локального списка
            diagnoses.value = diagnoses.value.filter(d => d.id !== id)
            
            // Обновляем localStorage
            localStorage.setItem('diagnosisHistory', JSON.stringify(diagnoses.value))

            // Обновляем статистику
            await updateUserStats()
        } catch (err) {
            // Если Supabase недоступен, удаляем только из localStorage
            console.warn('Supabase недоступен, удаляем из localStorage:', err.message)
            
            diagnoses.value = diagnoses.value.filter(d => d.id !== id)
            localStorage.setItem('diagnosisHistory', JSON.stringify(diagnoses.value))
        } finally {
            loading.value = false
        }
    }

    // Обновить статистику пользователя
    async function updateUserStats() {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Получаем текущую статистику
            const { data: currentStats } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (currentStats) {
                // Обновляем существующую статистику
                await supabase
                    .from('user_stats')
                    .update({
                        total_diagnoses: diagnoses.value.length,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', user.id)
            } else {
                // Создаем новую статистику
                await supabase
                    .from('user_stats')
                    .insert({
                        user_id: user.id,
                        total_diagnoses: diagnoses.value.length,
                        plants_saved: 0,
                        days_active: 1
                    })
            }
        } catch (err) {
            console.error('Ошибка обновления статистики:', err)
        }
    }

    // Получить последнюю диагностику
    function getLastDiagnosis() {
        return diagnoses.value[0] || null
    }

    // Очистить ошибки
    function clearError() {
        error.value = null
    }

    return {
        diagnoses,
        loading,
        error,
        currentDiagnosis,
        totalDiagnoses,
        averageConfidence,
        loadDiagnosisHistory,
        saveDiagnosis,
        deleteDiagnosis,
        getLastDiagnosis,
        clearError
    }
})
