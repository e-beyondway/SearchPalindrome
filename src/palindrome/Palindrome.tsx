import { useEffect, useState } from "react";

function Palindrome() {
  const [palindrome, setPalindrome] = useState<String>("");

  useEffect(() => {
    setTimeout(() => setPalindrome("papalindromeme"), 1000);
  }, []);

  const searchPalindrome = (string: String) => {
    const stringLength: Number = string.length;

    // рекурсия съедает много памяти,
    // так как выделяет память на новое пространство,
    // для каждой итерации рекурсии
    // лучше использовать цикл, но через цикл мы не можем решить таким алгоритмом)))
    // реверсируем строку индексами

    let result: String[] = [];

    const searchP = (
      string: String,
      stringLength: Number,
      fragmentLength: Number = 0,
      result: String[] = []
    ): String[] => {
      fragmentLength = fragmentLength > 0 ? fragmentLength : stringLength;
      let stringOffset: number = +stringLength - +fragmentLength;

      let leftFragment = "";
      let RightFragment = "";

      // left search
      // p a p a l i n d r o m e m e
      // e m e m o r d n i l a p a p
      // ...........................
      // a p a p
      // p a p                       - "p a p" is palindrome
      // a p
      for (let i = 0; i < fragmentLength; i++) {
        if (string[i] === string[+fragmentLength - (i + 1)]) {
          leftFragment += string[i];
        } else if (leftFragment.length > 1) {
          result.push(leftFragment);
          leftFragment = "";
        }
      }

      // right search
      // p a p a l i n d r o m e m e
      // e m e m o r d n i l a p a p
      // ...........................
      //                   e m e m o
      //                     e m e m
      //                       e m e - "e m e" is palindrome
      //                         e m

      // первую итерацию можно пропустить, так как она аналогична итерации цикла left search
      for (let i = 1; i < fragmentLength; i++) {
        if (string[i + stringOffset] === string[string.length - (i + 1)]) {
          RightFragment += string[i + stringOffset];
        } else if (RightFragment.length > 1) {
          result.push(RightFragment);
          RightFragment = "";
        }
      }

      // если бы требовалось найти самый большой палиндром, то можно было бы проверить его длину и выйти из рекурсии

      // if (result.length >= fragmentLength) {
      if (fragmentLength <= 1) {
        return result as String[];
      } else {
        return searchP(string, stringLength, +fragmentLength - 1, result);
      }
    };

    result = searchP(string, stringLength);

    // console.log(result);

    return result.join(" | ");
  };

  return (
    <>
      <h2>Search palindrome in:</h2>
      <h1>{palindrome}</h1>
      <span>{searchPalindrome(palindrome)}</span>
    </>
  );
}

export default Palindrome;
