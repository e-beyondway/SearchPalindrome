export interface PalindromeLogInterface {
  palindrome: string;
  stack: [
    {
      leftSubString: string;
      rightSubString: string;

      subStringLength: number;
      stringLength: number;
      results: string[];

      iteration: {
        circleIdx: number;
        left: {
          fragment: string;
          condition: string;
        };
        right: {
          fragment: string;
          condition: string;
        };
      }[];
    }
  ];
}

const Palindrome = (string: string): string => {
  const stringLength: number = string.length;

  // рекурсия съедает много памяти,
  // так как выделяет память на новое пространство,
  // для каждой итерации рекурсии
  // лучше использовать цикл, но через рекурсию мы не можем решить таким алгоритмом,
  // или я пока не могу)))

  // реверсируем строку индексами

  const scanPalindrome = (
    string: string,
    stringLength: number,
    subStringLength: number = 0,
    result: string = ""
  ): string => {
    subStringLength = subStringLength > 0 ? subStringLength : stringLength;
    let stringOffset: number = +stringLength - +subStringLength;

    let leftFragment = "";
    let RightFragment = "";

    // left search
    // p a p a l i n d r o m e m e
    // e m e m o r d n i l a p a p
    // ...........................
    // a p a p
    // p a p                       - "p a p" is palindrome
    // a p
    for (let i = 0; i < subStringLength; i++) {
      if (string[i] === string[+subStringLength - (i + 1)]) {
        leftFragment += string[i];
      } else {
        leftFragment = "";
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
      if (string[i + stringOffset] === string[string.length - (i + 1)]) {
        RightFragment += string[i + stringOffset];
      } else {
        RightFragment = "";
      }

      // записываем палиндром, от 2 символов
      if (leftFragment.length > 1 || RightFragment.length > 1) {
        leftFragment.length >= result.length && (result = leftFragment);
        RightFragment.length >= result.length && (result = RightFragment);
      }
    }

    if (subStringLength <= 1) {
      return result as string;
    } else {
      return scanPalindrome(string, stringLength, +subStringLength - 1, result);
    }
  };

  return scanPalindrome(string, stringLength);
};

export const PalindromeWithLog = (string: string): PalindromeLogInterface => {
  const stringLength: number = string.length;

  const emptyLog = (): PalindromeLogInterface => ({
    palindrome: "" as string,
    stack: [
      {
        leftSubString: string,
        rightSubString: string,
        subStringLength: 0,
        stringLength: 0,
        results: [] as string[],
        iteration: [
          {
            circleIdx: 0,
            left: {
              fragment: "",
              condition: "",
            },
            right: {
              fragment: "",
              condition: "",
            },
          },
        ],
      },
    ],
  });

  // TODO: беспредел)) с необязательным параметром log убрать, так что бы не было пустым первое значение stack
  const scanPalindromeWithLog = (
    string: string,
    stringLength: number,
    subStringLength: number = 0,
    result: string = "",
    log: PalindromeLogInterface = emptyLog()
  ): PalindromeLogInterface => {
    subStringLength = subStringLength > 0 ? subStringLength : stringLength;
    let stringOffset: number = +stringLength - +subStringLength;

    let leftFragment = "";
    let RightFragment = "";
    let leftSubString = "";
    let rightSubString = "";

    // для логов
    const iteration = [];
    const results = [];
    // const leftSubString = '';
    // const rightSubString = '';

    for (let i = 0; i < subStringLength; i++) {
      // формируем фрагменты, или обнуляем
      leftSubString += string[+subStringLength - (i + 1)];
      if (string[i] === string[+subStringLength - (i + 1)]) {
        leftFragment += string[i];
      } else {
        leftFragment = "";
      }

      // формируем фрагменты, или обнуляем
      rightSubString += string[string.length - (i + 1)];
      if (string[i + stringOffset] === string[string.length - (i + 1)]) {
        RightFragment += string[i + stringOffset];
      } else {
        RightFragment = "";
      }

      // записываем палиндром, от 2 символов
      if (leftFragment.length > 1 || RightFragment.length > 1) {
        leftFragment.length >= result.length && (result = leftFragment);
        RightFragment.length >= result.length && (result = RightFragment);
      }

      // логируем
      leftFragment.length > 1 && results.push(leftFragment);
      RightFragment.length > 1 && results.push(RightFragment);

      iteration.push({
        circleIdx: i,
        left: {
          fragment: leftFragment,
          condition: string[i] + "===" + string[+subStringLength - (i + 1)],
        },
        right: {
          fragment: RightFragment,
          condition:
            string[i + stringOffset] + "===" + string[string.length - (i + 1)],
        },
      });
    }

    log.palindrome = result;

    // как то пофиксить пустой первый stack...
    if (log.stack[0].subStringLength === 0) {
      log.stack[0] = {
        leftSubString: leftSubString,
        rightSubString: rightSubString,
        subStringLength: subStringLength,
        stringLength: stringLength,
        results: results,
        iteration: iteration,
      };
    } else {
      log.stack.push({
        leftSubString: leftSubString,
        rightSubString: rightSubString,
        subStringLength: subStringLength,
        stringLength: stringLength,
        results: results,
        iteration: iteration,
      });
    }

    if (subStringLength <= 2) {
      return log;
    } else {
      return scanPalindromeWithLog(
        string,
        stringLength,
        +subStringLength - 1,
        result,
        log
      );
    }
  };

  return scanPalindromeWithLog(string, stringLength);
};

export default Palindrome;
