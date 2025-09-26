import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, onClear }) => {
    return (
    <div className="search-bar">
        <div className="search-input-container">
        <input
            type="text"
            placeholder="Rechercher par nom, code, description"
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








/*
explication du code searchBar.js
on importe la librairie react
on crée un composant fonctionnel SearchBar qui prend en props searchTerm, onSearchChange et onClear
ses props sont utilisés pour gérer l'état de la barre de recherche
onChange est appelé à chaque fois que l'utilisateur tape dans le champ de recherche
e.target.value permet de récupérer la valeur actuelle du champ de recherche


*/