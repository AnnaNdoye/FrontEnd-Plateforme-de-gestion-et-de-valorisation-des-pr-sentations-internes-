const DepartementList = ({ departements, onEdit, onDelete }) => {
    if (departements.length === 0) {
        return (
            <div className="empty-state">
                <p>Aucun département trouvé.</p>
            </div>
        );
    }

    return (
        <div className="departement-list">
            <div className="table-container">
                <table className="departements-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Nom</th>
                            <th>Description</th>
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

export default DepartementList;











/*
const DepartementList = ({ departements, onEdit, onDelete }) => { sert à créer un composant fonctionnel
React nommé DepartementList qui prend en props une liste de départements (departements) et deux fonctions de 
rappel (onEdit et onDelete) pour gérer les actions d'édition et de suppression des départements.

*/