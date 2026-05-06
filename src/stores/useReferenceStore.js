import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/services/supabaseClient'

export const useReferenceStore = defineStore('reference', () => {
    // Состояние
    const diseases = ref([])
    const loading = ref(false)
    const error = ref(null)
    const selectedDisease = ref(null)

    // Загрузить справочник болезней из Supabase
    async function loadDiseases() {
        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .from('plant_diseases')
                .select('*')
                .order('name', { ascending: true })

            if (fetchError) throw fetchError

            diseases.value = data || []
            return data
        } catch (err) {
            error.value = err.message
            console.error('Ошибка загрузки справочника:', err)
            // Используем локальные данные как запасной вариант
            diseases.value = getLocalDiseases()
        } finally {
            loading.value = false
        }
    }

    // Получить болезнь по ID
    async function getDiseaseById(id) {
        loading.value = true
        error.value = null

        try {
            const { data, error: fetchError } = await supabase
                .from('plant_diseases')
                .select('*')
                .eq('id', id)
                .single()

            if (fetchError) throw fetchError

            selectedDisease.value = data
            return data
        } catch (err) {
            error.value = err.message
            console.error('Ошибка загрузки болезни:', err)
        } finally {
            loading.value = false
        }
    }

    // Поиск болезней по названию или симптомам
    function searchDiseases(query) {
        if (!query) return diseases.value
        
        const lowerQuery = query.toLowerCase()
        return diseases.value.filter(disease => 
            disease.name.toLowerCase().includes(lowerQuery) ||
            (disease.description && disease.description.toLowerCase().includes(lowerQuery)) ||
            (disease.symptoms && disease.symptoms.some(s => s.toLowerCase().includes(lowerQuery)))
        )
    }

    // Локальные данные как запасной вариант
    function getLocalDiseases() {
        return [
            {
                id: '1',
                name: 'Мучнистая роса',
                description: 'Грибковое заболевание, проявляющееся в виде белого налёта на листьях и стеблях.',
                symptoms: ['Белый налёт', 'Пожелтение листьев', 'Деформация'],
                treatment: 'Обработка фунгицидом, улучшение вентиляции',
                prevention: 'Избегать избыточной влажности, обеспечить циркуляцию воздуха',
                severity: 'Средняя'
            },
            {
                id: '2',
                name: 'Паутинный клещ',
                description: 'Мелкие вредители, питающиеся соком растений.',
                symptoms: ['Паутина на листьях', 'Желтые точки', 'Опадание листьев'],
                treatment: 'Обработка акарицидами, повышение влажности',
                prevention: 'Регулярный осмотр, поддержание влажности',
                severity: 'Высокая'
            },
            {
                id: '3',
                name: 'Корневая гниль',
                description: 'Заболевание корней, вызванное избыточным поливом.',
                symptoms: ['Увядание', 'Пожелтение', 'Мягкие корни'],
                treatment: 'Пересадка, удаление гнилых корней, обработка',
                prevention: 'Правильный полив, хороший дренаж',
                severity: 'Высокая'
            }
        ]
    }

    // Получить совет дня
    async function getDailyTip() {
        try {
            // Получаем случайный активный совет
            const { data, error } = await supabase
                .from('daily_tips')
                .select('tip_text')
                .eq('is_active', true)
                .order('display_order', { ascending: true })
                .limit(1)
                .single()

            if (error) throw error

            return data?.tip_text || getDefaultTip()
        } catch (err) {
            console.error('Ошибка загрузки совета:', err)
            return getDefaultTip()
        }
    }

    // Совет по умолчанию
    function getDefaultTip() {
        return 'Совет дня: проверяйте влажность почвы перед поливом'
    }

    // Очистить ошибки
    function clearError() {
        error.value = null
    }

    return {
        diseases,
        loading,
        error,
        selectedDisease,
        loadDiseases,
        getDiseaseById,
        searchDiseases,
        getDailyTip,
        clearError
    }
})
