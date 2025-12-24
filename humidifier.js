function solveHumidifier(input_str) {
  const lines = input_str.trim().split('\n');
  const N = parseInt(lines[0]);
  
  let water = 0;
  let prevTime = 0;
  
  for (let i = 1; i <= N; i++) {
    const [T_i, V_i] = lines[i].split(' ').map(Number);
    
    // Вычисляем время между предыдущим доливом и текущим
    const deltaTime = T_i - prevTime;
    
    // Вода убывает со скоростью 1 л/единицу времени
    // Не может быть отрицательной
    water = Math.max(0, water - deltaTime);
    
    // Добавляем новый долив
    water += V_i;
    
    // Обновляем время предыдущего долива
    prevTime = T_i;
  }
  
  return water.toString();
}

// Тесты
console.log('Тест 1:');
const test1 = `4
1 3
3 1
4 4
7 1`;
console.log(solveHumidifier(test1)); // Ожидается: 3

console.log('\nТест 2:');
const test2 = `3
1 8
10 11
21 5`;
console.log(solveHumidifier(test2)); // Ожидается: 5

console.log('\nТест 3:');
const test3 = `10
2 1
22 10
26 17
29 2
45 20
47 32
72 12
75 1
81 31
97 7`;
console.log(solveHumidifier(test3)); // Ожидается: 57


