import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, onClear }) => {
    return (
    <div className="search-bar">
        <div className="search-input-container">
        <input
            type="text"
            placeholder="Rechercher par nom, code ou description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
        />
        {searchTerm && (
            <button
            onClick={onClear}
            className="clear-button"
            type="button"
            >
            ✕
            </button>
        )}
        </div>
    </div>
    );
};

export default SearchBar;