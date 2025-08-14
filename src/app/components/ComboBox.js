import { useState } from "react";
import languages from "../../data/langcodes.json";

export default function ComboBox({ onChange }) {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const maxVisible = 7;

  function handleChange(e) {
    const value = e.target.value;
    setInputValue(value);

    const filtered = Object.keys(languages).filter((languageName) =>
      languageName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered);

    const exactMatch = Object.entries(languages).find(
      ([languageName]) => languageName.toLowerCase() === value.toLowerCase()
    );

    onChange(
      exactMatch
        ? { language: exactMatch[0], code: exactMatch[1] }
        : { language: value, code: "und" }
    );
  }

  function handleSelect([languageName, code]) {
    setInputValue(languageName);
    setFilteredOptions([]);
    onChange({ language: languageName, code }); // Save selection up to parent
  }

  function handleBlur() {
    const match = Object.entries(languages).find(
      ([languageName]) =>
        languageName.toLowerCase() === inputValue.toLowerCase()
    );

    onChange(
      match
        ? { language: match[0], code: match[1] }
        : { language: inputValue, code: "und" }
    );
    setFilteredOptions([]);
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <label style={{ fontWeight: "bold" }}>
        Target Language:
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Type or select..."
          style={{
            width: "100%",
            padding: "0.5rem",
            marginTop: "0.25rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "1rem",
            fontFamily: "Arial",
            backgroundColor: "white",
            color: "black",
          }}
        />
      </label>
      {inputValue.length > 0 && filteredOptions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            border: "1px solid #ccc",
            maxHeight: "150px",
            overflowY: "auto",
            background: "white",
            margin: 0,
            padding: 0,
            listStyle: "none",
            zIndex: 10,
          }}
        >
          {filteredOptions.slice(0, maxVisible).map((languageName) => (
            <li
              key={languageName}
              onMouseDown={() =>
                handleSelect([languageName, languages[languageName]])
              }
              style={{ padding: "0.5rem", cursor: "pointer" }}
            >
              {languageName}
            </li>
          ))}

          {filteredOptions.length > maxVisible && (
            <li
              style={{
                paddingLeft: "0.5rem",
                color: "gray",
                cursor: "default",
              }}
            >
              ...
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
