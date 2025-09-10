import { useState, useEffect } from 'react'

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('App démarré');
    
    fetch('http://localhost:3001/api/users')
      .then(response => {
        console.log('Réponse reçue:', response);
        return response.json();
      })
      .then(data => {
        console.log('Données reçues:', data);
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  console.log('Rendu avec:', { users, loading, error });

  if (loading) {
    return <div style={{padding: '20px', fontSize: '20px'}}>Chargement...</div>;
  }

  if (error) {
    return <div style={{padding: '20px', color: 'red'}}>Erreur: {error}</div>;
  }

  return (
    <div style={{padding: '20px'}}>
      <h1 style={{color: 'blue'}}>Test Simple</h1>
      <p>Nombre d'utilisateurs: {users.length}</p>
      <ul>
        {users.map((user: any) => (
          <li key={user.id} style={{margin: '10px 0'}}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
