import { reactive } from 'vue';

// Создаем объект данных
export const userStore = reactive({
  name: 'Иван',
  age: 25,
  
  // Метод изменения данных
  growOlder() {
    this.age++;
  }
});