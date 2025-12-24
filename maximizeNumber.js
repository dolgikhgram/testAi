function maximizeNumber(A, B) {
  // Преобразуем строки в массивы символов
  const arrA = A.split('');
  const arrB = B.split('').map(Number);
  
  // Сортируем цифры B по убыванию (чтобы использовать самые большие сначала)
  arrB.sort((a, b) => b - a);
  
  let bIndex = 0; // Индекс текущей цифры из B
  
  // Проходим по каждой позиции в A
  for (let i = 0; i < arrA.length && bIndex < arrB.length; i++) {
    const currentDigit = parseInt(arrA[i]);
    
    // Если текущая цифра из B больше цифры в A, заменяем
    if (arrB[bIndex] > currentDigit) {
      arrA[i] = arrB[bIndex].toString();
      bIndex++; // Использовали цифру из B
    }
  }
  
  return arrA.join('');
}

// Тесты
console.log('Тест 1:');
console.log('A = "123", B = "45"');
console.log('Результат:', maximizeNumber("123", "45")); // Ожидается: "523"

console.log('\nТест 2:');
console.log('A = "123", B = "9"');
console.log('Результат:', maximizeNumber("123", "9")); // Ожидается: "923"

console.log('\nТест 3:');
console.log('A = "999", B = "123"');
console.log('Результат:', maximizeNumber("999", "123")); // Ожидается: "999" (ничего не заменяем)

console.log('\nТест 4:');
console.log('A = "1234", B = "9876"');
console.log('Результат:', maximizeNumber("1234", "9876")); // Ожидается: "9876" (заменяем все)

console.log('\nТест 5:');
console.log('A = "1111", B = "9"');
console.log('Результат:', maximizeNumber("1111", "9")); // Ожидается: "9111" (заменяем первую)

console.log('\nТест 6:');
console.log('A = "123", B = "21"');
console.log('Результат:', maximizeNumber("123", "21")); // Ожидается: "323" (используем 3 и 2, но 3 больше 2, так что "323")


