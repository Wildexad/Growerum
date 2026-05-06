-- ============================================
-- СХЕМА БАЗЫ ДАННЫХ GROWERUM
-- Выполните этот SQL в Supabase SQL Editor
-- ============================================

-- 1. Таблица истории диагностик
CREATE TABLE IF NOT EXISTS diagnosis_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    disease_name VARCHAR(255) NOT NULL,
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    description TEXT,
    recommendations JSONB,
    explanation JSONB,
    answers JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для ускорения запросов
CREATE INDEX IF NOT EXISTS idx_diagnosis_user_id ON diagnosis_history(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_created_at ON diagnosis_history(created_at DESC);

-- 2. Таблица справочника болезней растений
CREATE TABLE IF NOT EXISTS plant_diseases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    symptoms JSONB,
    treatment TEXT,
    prevention TEXT,
    severity VARCHAR(50) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_plant_diseases_name ON plant_diseases(name);

-- 3. Таблица советов дня
CREATE TABLE IF NOT EXISTS daily_tips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tip_text TEXT NOT NULL,
    category VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_tips_active ON daily_tips(is_active) WHERE is_active = true;

-- 4. Таблица сохраненных растений пользователя
CREATE TABLE IF NOT EXISTS user_plants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plant_name VARCHAR(255) NOT NULL,
    plant_type VARCHAR(255),
    notes TEXT,
    added_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_watered TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_plants_user_id ON user_plants(user_id);

-- ============================================
-- POLITICS БЕЗОПАСНОСТИ (RLS - Row Level Security)
-- ============================================

-- Включаем RLS для всех таблиц
ALTER TABLE diagnosis_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plants ENABLE ROW LEVEL SECURITY;

-- Политика для diagnosis_history: пользователи видят только свои записи
CREATE POLICY "Users can view their own diagnosis history"
    ON diagnosis_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnosis history"
    ON diagnosis_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnosis history"
    ON diagnosis_history FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnosis history"
    ON diagnosis_history FOR DELETE
    USING (auth.uid() = user_id);

-- Политика для user_plants: пользователи видят только свои растения
CREATE POLICY "Users can view their own plants"
    ON user_plants FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plants"
    ON user_plants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plants"
    ON user_plants FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plants"
    ON user_plants FOR DELETE
    USING (auth.uid() = user_id);

-- Для plant_diseases и daily_tips доступ на чтение всем авторизованным пользователям
ALTER TABLE plant_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view plant diseases"
    ON plant_diseases FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Anyone can view daily tips"
    ON daily_tips FOR SELECT
    TO authenticated
    USING (true);

-- ============================================
-- ФУНКЦИИ И ТРИГГЕРЫ
-- ============================================

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_diagnosis_history_updated_at
    BEFORE UPDATE ON diagnosis_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plant_diseases_updated_at
    BEFORE UPDATE ON plant_diseases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_tips_updated_at
    BEFORE UPDATE ON daily_tips
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plants_updated_at
    BEFORE UPDATE ON user_plants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
