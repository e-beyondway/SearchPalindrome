import React, { useEffect, useState } from "react";
import { PalindromeWithLog, PalindromeLogInterface } from "./Palindrome";
import { v4 as uuidv4 } from "uuid";
import "./Palindrome.scss";

function PalindromeComponent() {
  const [valueString, setValueString] = useState<string>("");
  const [palindromeLog, setPalindromeLog] = useState<PalindromeLogInterface>();
  const [palindrome, setPalindrome] = useState<string>("");
  const [leftSubStringRows, setLeftSubStringRows] = useState<string[]>();
  const [rightSubStringRows, setRightSubStringRows] = useState<string[]>();

  useEffect(() => {
    getPalindromeData("sadas");
  }, []);

  const getPalindromeData = (string: string) => {
    document.documentElement.style.setProperty(
      "--palindrome-grid-cols",
      string.length.toString()
    );

    setValueString(string);

    const data = PalindromeWithLog(string);

    const subStrings = data.stack.reduce(
      (acc, i) => {
        const emptyArr = new Array(i.stringLength - i.subStringLength).fill(
          " "
        );
        acc.left.push(i.leftSubString + emptyArr.join(""));
        acc.right.push(emptyArr.join("") + i.rightSubString);
        return acc;
      },
      { left: [] as string[], right: [] as string[] }
    );

    // subStrings;
    setLeftSubStringRows(subStrings.left);
    setRightSubStringRows(subStrings.right);

    setPalindromeLog(data);
    setPalindrome(data.palindrome);
  };

  const handlerInputPalindrome = (
    e: React.FormEvent<HTMLInputElement>
  ): void => {
    getPalindromeData(e?.currentTarget.value);
  };

  const row = (string: string | string[]) => {
    if (typeof string === "string") string = string.split("");

    const data = string.map((el) => {
      return (
        <div className="palindrome-cell" key={uuidv4()}>
          {el}
        </div>
      );
    });

    return (
      <div className="palindrome-row" key={uuidv4()}>
        {data}
      </div>
    );
  };

  const viewValueString = (string: string) => {
    return row(string);
  };

  const viewStackRows = (rows: string[]) => {
    return rows.map((i) => row(i));
  };

  const renderPalindromeLog = () => {
    return <pre className="json">{JSON.stringify(palindromeLog, null, 2)}</pre>;
  };

  return (
    <>
      <h2>Search palindrome in:</h2>

      <input value={valueString} onChange={handlerInputPalindrome} />

      {row(valueString)}
      <hr />
      {leftSubStringRows && viewStackRows(leftSubStringRows)}
      {rightSubStringRows && viewStackRows(rightSubStringRows)}

      <hr />
      {viewValueString(palindrome)}
      <code>{renderPalindromeLog()}</code>

      {/* <span>{searchPalindrome(palindrome)}</span> */}
    </>
  );
}

export default PalindromeComponent;
