import { useState } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
    display: flex;
    width: 100%;
    filter: drop-shadow(0 5px 15px rgba(0,0,0,0.05));

    input {
    flex: 1;
    padding: 1rem 1.5rem;
    border: 2px solid #eee;
    border-right: none;
    border-radius: 30px 0 0 30px;
    outline: none;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
        border-color: #FF8113;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.1);
    }
    }

    button {
    padding: 0 1.8rem;
    background: linear-gradient(135deg, #FF8113, #c38b4aff);
    color: white;
    border: none;
    border-radius: 0 30px 30px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:hover {
        background: linear-gradient(135deg, #FF8113, #FFD700);
        transform: translateX(3px);
    }
    
    svg {
        font-size: 1.2rem;
        }
    }
`;

const Recherche = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
        onSearch(searchTerm);
    }
    };

    return (
    <SearchContainer>
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
        <input 
            type="text" 
            placeholder="Rechercher une présentation..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
            <FaSearch />
        </button>
        </form>
    </SearchContainer>
    );
};

export default Recherche;
