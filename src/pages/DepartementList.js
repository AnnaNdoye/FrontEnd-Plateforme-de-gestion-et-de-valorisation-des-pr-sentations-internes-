import React from 'react';

const DepartementList = ({departements, onEdit, onDelete}) =>{
    if(departements.length === 0){
        return(
            <div classNmae="empty-state">
                <p>Aucun département trouvé.</p>
            </div>
        );
    }
    
    else{
        return(
            <div className="departement-list">
                <div className="table-container">
                    <table className="departements-table">
                        <thead>
                            <tr>
                            <th>Code</th>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Employés</th>
                            <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departements.map((dept) => (
                            <tr key={dept.id}>
                                <td>
                                    <span className="code-badge">{dept.code}</span>
                                </td>
                                <td>
                                    <strong>{dept.nom}</strong>
                                </td>
                                <td>
                                    <span className="description">
                                        {dept.description || 'Aucune description'}
                                    </span>
                                </td>
                                <td>
                                    <span className="employes-count">{dept.nombreEmployes}</span>
                                </td>
                                <td>
                                    <div className="actions">
                                        <button
                                        onClick={() => onEdit(dept)}
                                        className="btn btn-sm btn-primary"
                                        >
                                            Modifier
                                        </button>
                                        <button
                                        onClick={() => onDelete(dept)}
                                        className="btn btn-sm btn-danger"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
        };
    }

export default DepartementList;