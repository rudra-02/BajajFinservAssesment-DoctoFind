import { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ searchQuery, onSearchChange, doctors }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(searchQuery);
  
  // Generate suggestions based on input
  useEffect(() => {
    if (inputValue.trim() === '') {
      setSuggestions([]);
      return;
    }
    
    const filteredDoctors = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 3); // Get top 3 matches
    
    setSuggestions(filteredDoctors);
  }, [inputValue, doctors]);
  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setShowSuggestions(true);
  };
  
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearchChange(inputValue);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (name) => {
    setInputValue(name);
    onSearchChange(name);
    setShowSuggestions(false);
  };
  
  const handleBlur = () => {
    // Delay hiding suggestions to allow clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };
  
  return (
    <div className="search-container">
      <input
        type="text"
        data-testid="autocomplete-input"
        placeholder="Search doctors by name"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={handleBlur}
        className="search-input"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((doctor, index) => (
            <li 
              key={doctor.id || index} 
              data-testid="suggestion-item"
              onClick={() => handleSuggestionClick(doctor.name)}
              className="suggestion-item"
            >
              <div className="suggestion-image">
                <img src={doctor.photo || "https://via.placeholder.com/40"} alt={doctor.name} />
              </div>
              <div className="suggestion-info">
                <span className="suggestion-name">{doctor.name}</span>
                <span className="suggestion-specialty">
                  {doctor.specialities?.map(spec => spec.name).join(', ')}
                </span>
              </div>
              <div className="suggestion-arrow">›</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;