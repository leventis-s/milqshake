import { useState, useEffect } from "react";
import languages from "../../data/langcodes.json";

export default function ComboBox({ value, onChange }) {
  const [inputValue, setInputValue] = useState(value || "");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const maxVisible = 7;
  

  // Sync inputValue with parent
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  function handleChange(e) {
    const val = e.target.value;
    setInputValue(val);
    setShowDropdown(true);

    const filtered = Object.keys(languages).filter((languageName) =>
      languageName.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredOptions(filtered);

    const exactMatch = Object.entries(languages).find(
      ([languageName]) => languageName.toLowerCase() === val.toLowerCase()
    );

    onChange(
      exactMatch
        ? { language: exactMatch[0], code: exactMatch[1] }
        : { language: val, code: "und" }
    );
  }

  function handleSelect(languageName) {
    setInputValue(languageName);
    setFilteredOptions([]);
    setShowDropdown(false);
    onChange({ language: languageName, code: languages[languageName] });
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      Target Langauge 
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setShowDropdown(true)}
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
      {showDropdown && filteredOptions.length > 0 && (
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
              onMouseDown={() => handleSelect(languageName)} // use onMouseDown to prevent blur
              style={{ padding: "0.5rem", cursor: "pointer" }}
            >
              {languageName}
            </li>
          ))}
          {filteredOptions.length > maxVisible && (
            <li style={{ paddingLeft: "0.5rem", color: "gray" }}>...</li>
          )}
        </ul>
      )}
    </div>
  );
}
