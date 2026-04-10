<!-- <script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <HelloWorld />
</template> -->
<template>
  <div class="app-container">
    <h1>MVVM Пdример</h1>

    <!-- VIEW: Отображение данных -->
    <div class="card">
      <p><strong>Имя:</strong> {{ user.name }}</p>
      <p><strong>Возраст:</strong> {{ user.age }}</p>
      <p><strong>Статус:</strong> {{ status }}</p>
      
      <!-- VIEW: Действие пользователя -->
      <button @click="user.growOlder()">🎂 Стать старше</button>
    </div>
  </div>
</template>

<script setup>
// 👇 ВОТ ЭТА СТРОКА СОЕДИНЯЕТ View с ViewModel
import { useUser } from './composables/useUser';

// Вызываем функцию из ViewModel, чтобы получить данные
const { user, status } = useUser();
</script>

<style>
.app-container { font-family: sans-serif; padding: 20px; }
.card { border: 1px solid #ccc; padding: 20px; border-radius: 8px; max-width: 300px; }
button { margin-top: 10px; cursor: pointer; }
</style>