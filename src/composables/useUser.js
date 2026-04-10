import { computed } from 'vue';
// 👇 ВОТ ЭТА СТРОКА СОЕДИНЯЕТ ViewModel с Model
import { userStore } from '../stores/user'; 

export function useUser() {
  // Берем данные из Model
  const user = userStore;

  // Добавляем логику (вычисляемые свойства)
  const status = computed(() => {
    return user.age >= 18 ? 'Взрослый' : 'Ребенок';
  });

  // Возвращаем всё, что нужно View
  return {
    user,
    status
  };
}