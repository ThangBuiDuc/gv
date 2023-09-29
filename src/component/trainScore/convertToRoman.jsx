function convertToRoman(num) {
  let numberArr = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  let RomanArr = [
    "M",
    "CM",
    "D",
    "CD",
    "C",
    "XC",
    "L",
    "XL",
    "X",
    "IX",
    "V",
    "IV",
    "I",
  ];
  let result = [];

  const findElement = (e) => {
    return e <= num;
  };

  while (num > 0) {
    let nextHighest = numberArr.find(findElement);

    result.push(RomanArr[numberArr.indexOf(nextHighest)]);
    num -= nextHighest;
  }
  let newResult = result.join("");

  return newResult;
}

export default convertToRoman;
