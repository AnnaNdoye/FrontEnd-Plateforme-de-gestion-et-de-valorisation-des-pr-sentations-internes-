Résumé connaissance react

un hook est une fonction qui permet d'accrocher des fonctionnalités react dans  une composante
useState, useEffect,useContet,useRef

1-DepartementsPage
import React, { useState, useEffect } from 'react';
importe la librairie react ainsi que les hooks(usestate: pour gérer l'état et useeffect pour l'effet de bord)


--const [departements, setDepartements] = useState([]);
departements est une variable d'états et setdepartements permet de mettre à jour cette variable

--const: mot clé react pour déclarer une constante, on peut modifier l'objet pointé

--useState(): sert à gérer un état local dans un composant.
useState([]): pour stocker une liste au départ qui est vide
useState(''): pour stocker une chaine de caractères vide au départ utiliser pour les input, les formulaire ou recherche
useState(true ou false): c'est un booléen, utiliser pour stocker un état oui/non, ouvert/fermé
useState(null): indéfini pour le moment, dans l'attente d'une donnée pour effectuer l'action


--const DepartementsPage = () => 
DepartementsPage: est le nom de la composante react du même nom que le fichier
 () =>: fonction fléchée
DepartementsPage est une constante qui contient une fonction fléchée
on peut aussi utiliser la balise DepartementsPage


--useEffect: charger des effets de bord, éxécute du code en réaction à un événement dans le cycle de la composante react
useEffect(() => {
        loadDepartements();
    }, []);

    // Filtrer les départements quand le terme de recherche change
    useEffect(() => {
        filterDepartements();
    }, [searchTerm, departements]);
loadDepartements() est appelé une seule fois au montage du composant (quand il apparaît) parce que le tableau de dépendances [] est vide → ça veut dire : « exécute cet effet une seule fois ».

filterDepartements() est exécuté à chaque fois que searchTerm ou departements change.
[searchTerm, departements] = c'est le tableau de dépendances.


--mot clé async est un mot clé qui retourne une promesse
await : attend la résolution d'une Promise avant de continuer l'exécution

## 1. Imports et dépendances

```javascript
import React, { useState, useEffect } from 'react';
```
- Importe React et les hooks `useState` (pour gérer l'état) et `useEffect` (pour les effets de bord)

```javascript
import { departementService } from '../services/departementService';
```
- Importe un service personnalisé qui gère les appels API pour les départements

```javascript
import SearchBar from './SearchBar';
import DepartementList from './DepartementList';
import DepartementForm from './DepartementForm';
import ConfirmDialog from './ConfirmDialog';
```
- Importe les composants enfants utilisés dans cette page

## 2. Déclaration du composant et état initial

```javascript
const DepartementsPage = () => {
```
- Déclare un composant fonctionnel React

```javascript
const [departements, setDepartements] = useState([]);
```
- État pour stocker la liste complète des départements

```javascript
const [filteredDepartements, setFilteredDepartements] = useState([]);
```
- État pour stocker les départements filtrés par la recherche

```javascript
const [searchTerm, setSearchTerm] = useState('');
```
- État pour stocker le terme de recherche saisi par l'utilisateur

```javascript
const [showForm, setShowForm] = useState(false);
```
- État booléen pour contrôler l'affichage du formulaire d'ajout/modification

```javascript
const [editingDepartement, setEditingDepartement] = useState(null);
```
- État pour stocker le département en cours de modification (null = mode ajout)

```javascript
const [showDeleteDialog, setShowDeleteDialog] = useState(false);
```
- État booléen pour contrôler l'affichage de la boîte de confirmation de suppression

```javascript
const [departementToDelete, setDepartementToDelete] = useState(null);
```
- État pour stocker le département à supprimer

```javascript
const [loading, setLoading] = useState(true);
```
- État booléen pour gérer l'affichage du chargement

```javascript
const [error, setError] = useState('');
```
- État pour stocker les messages d'erreur

```javascript
const [successMessage, setSuccessMessage] = useState('');
```
- État pour stocker les messages de succès

## 3. Effets (useEffect)

```javascript
useEffect(() => {
    loadDepartements();
}, []);
```
- Se déclenche une seule fois au montage du composant (tableau de dépendances vide)
- Charge la liste des départements depuis l'API

```javascript
useEffect(() => {
    filterDepartements();
}, [searchTerm, departements]);
```
- Se déclenche quand `searchTerm` ou `departements` change
- Met à jour la liste filtrée

## 4. Fonction de chargement des départements

```javascript
const loadDepartements = async () => {
    try {
        setLoading(true);
```
- Active l'état de chargement

```javascript
        console.log('Chargement des départements...');
```
- Log de debug

```javascript
        await departementService.test();
        console.log('Connexion API OK');
```
- Teste la connexion à l'API avant de charger les données

```javascript
        const response = await departementService.getAll();
        console.log('Départements reçus:', response.data);
```
- Appel API pour récupérer tous les départements

```javascript
        const mappedDepartements = response.data.map(dept => ({
            id: dept.idDepartement,
            nom: dept.nomDepartement,
            code: dept.code,
            description: dept.description
        }));
```
- Transforme les données du backend (format API) vers le format frontend
- Utilise `.map()` pour créer un nouveau tableau avec la structure souhaitée

```javascript
        console.log('Départements mappés:', mappedDepartements);
        setDepartements(mappedDepartements);
        setError('');
```
- Met à jour l'état avec les données transformées et efface les erreurs

```javascript
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
```
- Capture et log les erreurs 

```javascript
        if (error.code === 'ERR_NETWORK') {
            setError('Impossible de se connecter au serveur...');
        } else if (error.response) {
            setError(`Erreur serveur: ${error.response.status}...`);
        } else {
            setError('Impossible de charger les départements');
        }
```
- Gestion différenciée des types d'erreurs avec messages appropriés

```javascript
    } finally {
        setLoading(false);
    }
```
- Désactive toujours l'état de chargement, même en cas d'erreur

## 5. Fonction de filtrage

```javascript
const filterDepartements = async () => {
    if (!searchTerm.trim()) {
        setFilteredDepartements(departements);
        return;
    }
```
- Si pas de terme de recherche, affiche tous les départements

```javascript
    try {
        const response = await departementService.search(searchTerm);
        const mappedResults = response.data.map(dept => ({...}));
        setFilteredDepartements(mappedResults);
    } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setFilteredDepartements([]);
    }
```
- Appel API pour rechercher et mapping des résultats

## 6. Handlers d'événements

```javascript
const handleSearchChange = (value) => {
    setSearchTerm(value);
};
```
- Met à jour le terme de recherche

```javascript
const handleAddNew = () => {
    setEditingDepartement(null);
    setShowForm(true);
};
```
- Ouvre le formulaire en mode ajout (editingDepartement = null)

```javascript
const handleEdit = (departement) => {
    setEditingDepartement(departement);
    setShowForm(true);
};
```
- Ouvre le formulaire en mode modification avec les données du département

```javascript
const handleDelete = (departement) => {
    setDepartementToDelete(departement);
    setShowDeleteDialog(true);
};
```
- Prépare la suppression et affiche la boîte de confirmation

## 7. Fonction de confirmation de suppression

```javascript
const confirmDelete = async () => {
    try {
        console.log('Suppression du département:', departementToDelete);
        await departementService.delete(departementToDelete.id);
        setSuccessMessage('Département supprimé avec succès');
        loadDepartements();
        setError('');
    } catch (error) {
        // Gestion d'erreur similaire aux autres fonctions
    } finally {
        setShowDeleteDialog(false);
        setDepartementToDelete(null);
    }
};
```
- Supprime le département via l'API et met à jour l'interface

## 8. Fonction de soumission du formulaire

```javascript
const handleFormSubmit = async (formData) => {
    try {
        console.log('Soumission du formulaire:', formData);
        
        const backendData = {
            nomDepartement: formData.nom,
            code: formData.code,
            description: formData.description
        };
```
- Transforme les données du formulaire vers le format API

```javascript
        if (editingDepartement) {
            await departementService.update(editingDepartement.id, backendData);
            setSuccessMessage('Département modifié avec succès');
        } else {
            await departementService.create(backendData);
            setSuccessMessage('Département ajouté avec succès');
        }
```
- Mode modification ou ajout selon l'état `editingDepartement`

```javascript
        setShowForm(false);
        setEditingDepartement(null);
        loadDepartements();
        setError('');
```
- Ferme le formulaire et recharge les données

## 9. Auto-effacement des messages

```javascript
useEffect(() => {
    if (successMessage) {
        const timer = setTimeout(() => setSuccessMessage(''), 3000);
        return () => clearTimeout(timer);
    }
}, [successMessage]);
```
- Efface automatiquement le message de succès après 3 secondes
- Le `return` nettoie le timer si le composant se démonte

## 10. Rendu conditionnel et JSX

```javascript
if (loading) {
    return (
        <div className="loading" style={{ /* styles inline */ }}>
            <p>Chargement des départements...</p>
        </div>
    );
}
```
- Affichage conditionnel pendant le chargement

```javascript
return (
    <div className="departements-page">
        <header className="page-header" style={{ /* styles */ }}>
            <h1 style={{ margin: 0 }}>Gestion des Départements</h1>
            <button onClick={handleAddNew} className="btn btn-primary">
                Ajouter un département
            </button>
        </header>
```
- Structure principale avec en-tête et bouton d'ajout

```javascript
{error && (
    <div className="alert alert-error" style={{ /* styles */ }}>
        {error}
    </div>
)}
```
- Affichage conditionnel des messages d'erreur (rendu seulement si `error` est truthy)

```javascript
{showForm && (
    <div className="form-overlay" style={{ /* overlay styles */ }}>
        <DepartementForm
            departement={editingDepartement}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isEditing={!!editingDepartement}
        />
    </div>
)}
```
- Modal overlay pour le formulaire avec passage de props

```javascript
<SearchBar
    searchTerm={searchTerm}
    onSearchChange={handleSearchChange}
    onClear={handleSearchClear}
/>
```
- Composant de recherche avec props pour la communication parent-enfant

```javascript
<div className="stats" style={{ /* styles */ }}>
    <p style={{ margin: 0 }}>
        {searchTerm
            ? `${filteredDepartements.length} département(s) trouvé(s)`
            : `${departements.length} département(s) au total`
        }
    </p>
</div>
```
- Affichage conditionnel des statistiques selon le mode recherche

```javascript
<DepartementList
    departements={filteredDepartements}
    onEdit={handleEdit}
    onDelete={handleDelete}
/>
```
- Liste des départements avec handlers pour les actions

```javascript
<ConfirmDialog
    isOpen={showDeleteDialog}
    title="Confirmer la suppression"
    message={`Êtes-vous sûr de vouloir supprimer le département "${departementToDelete?.nom}" ?`}
    onConfirm={confirmDelete}
    onCancel={() => setShowDeleteDialog(false)}
/>
```
- Boîte de dialogue de confirmation avec l'opérateur de chaînage optionnel `?.`

## Concepts clés utilisés :

1. **Hooks React** : useState, useEffect
2. **Programmation asynchrone** : async/await, try/catch
3. **Mapping de données** : transformation entre formats API et frontend
4. **Rendu conditionnel** : `{condition && <Component />}`
5. **Gestion d'état complexe** : multiple états interconnectés
6. **Communication parent-enfant** : via props et callbacks
7. **Gestion d'erreurs** : différents types d'erreurs avec messages appropriés
8. **Nettoyage** : clearTimeout dans useEffect
9. **Styles inline** : pour un prototypage rapide