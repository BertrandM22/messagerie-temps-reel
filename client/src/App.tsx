import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import './App.css'

interface User {
  id: number;
  name: string;
  email?: string;
}

interface Message {
  id: number;
  content: string;
  username: string;
  userId: number;
  timestamp: string;
  date?: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const socket = io(API_URL);

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUserName, setNewUserName] = useState<string>("");
  const [newUserEmail, setNewUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchData = async () => {
    try {
      const [usersResponse, messagesResponse] = await Promise.all([
        fetch(`${API_URL}/api/users`),
        fetch(`${API_URL}/api/messages`)
      ]);

      if (!usersResponse.ok || !messagesResponse.ok) {
        throw new Error('Erreur réseau');
      }

      const usersData = await usersResponse.json();
      const messagesData = await messagesResponse.json();

      setUsers(usersData);
      setMessages(messagesData);
      setError(null);
      setLoading(false);
    } catch (error) {
      setError('Impossible de récupérer les données du serveur');
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!newUserName.trim()) return;
    
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newUserName.trim(), 
          email: newUserEmail.trim() || undefined 
        })
      });
      
      if (response.ok) {
        const user = await response.json();
        setSelectedUser(user);
        setNewUserName("");
        setNewUserEmail("");
        fetchData();
      }
    } catch (error) {
      setError('Erreur lors de la création de l\'utilisateur');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) {
      return;
    }

    try {
      await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       body: JSON.stringify({
         content: newMessage,
         userId: selectedUser.id,
         username: selectedUser.name,
         date: new Date().toLocaleDateString('fr-FR', { 
           day: '2-digit', 
           month: '2-digit' 
         })
       })
      });
      
      setNewMessage("");
    } catch (error) {
      setError('Erreur lors de l\'envoi du message');
    }
  };

  const clearChat = async () => {
    // Demander le code administrateur de façon sécurisée
    const adminCode = prompt(' Code administrateur requis pour vider le chat :');
    
    if (!adminCode) {
      return; // Utilisateur a annulé
    }

    if (!confirm('⚠ Êtes-vous sûr de vouloir vider tout le chat ? Cette action est irréversible.')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/messages/clear`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminCode })
      });

      const result = await response.json();

      if (response.ok) {
        // Le chat sera automatiquement vidé grâce à l'événement WebSocket
        console.log('Chat vidé avec succès');
      } else {
        alert('❌ ' + (result.error || 'Code administrateur incorrect'));
      }
    } catch (error) {
      console.error('Erreur lors du vidage du chat:', error);
      alert('❌ Erreur lors du vidage du chat');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('messagesCleared', () => {
      setMessages([]);
    });

    return () => {
      socket.off('newMessage');
      socket.off('messagesCleared');
    };
  }, []);

  if (loading) {
    return (
      <div>
        <h1>Chat en Temps Réel</h1>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          color: '#333', 
          marginBottom: '2rem' 
        }}>
           Chat en Temps Réel
        </h1>

        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <button
            onClick={clearChat}
            style={{
              background: '#ff4757',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => (e.target as HTMLButtonElement).style.background = '#ff3742'}
            onMouseOut={(e) => (e.target as HTMLButtonElement).style.background = '#ff4757'}
          >
             Vider le chat
          </button>
        </div>

        {!selectedUser ? (
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
            padding: '2rem', 
            marginBottom: '1.5rem' 
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: '#555', 
              marginBottom: '1.5rem', 
              textAlign: 'center' 
            }}>
              Rejoignez le chat !
            </h2>
            
            <div style={{ 
              background: '#e3f2fd', 
              borderRadius: '8px', 
              padding: '1.5rem', 
              marginBottom: '1.5rem' 
            }}>
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '500', 
                color: '#1976d2', 
                marginBottom: '1rem' 
              }}>
                 Créer un nouveau profil
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                  type="text"
                  placeholder="Votre nom"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #bbdefb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <input
                  type="email"
                  placeholder="Email (optionnel)"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #bbdefb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={createUser}
                  disabled={!newUserName.trim()}
                  style={{
                    width: '100%',
                    background: newUserName.trim() ? '#1976d2' : '#ccc',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: newUserName.trim() ? 'pointer' : 'not-allowed',
                    transition: 'background-color 0.3s'
                  }}
                >
                  Créer mon profil
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
            overflow: 'hidden' 
          }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #1976d2 0%, #7b1fa2 100%)', 
              color: 'white', 
              padding: '1.5rem' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>
                    Connecté en tant que {selectedUser.name} 
                  </h2>
                  <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>
                    {users.length} utilisateur {users.length > 1 ? 's' : ''} en ligne
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Changer d'utilisateur
                </button>
              </div>
            </div>

            <div style={{ 
              height: '400px', 
              overflowY: 'auto', 
              padding: '1.5rem', 
              background: '#f5f5f5' 
            }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', marginTop: '5rem' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}></div>
                  <p>Aucun message encore... Soyez le premier à écrire !</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {messages.map(message => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.userId === selectedUser.id ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '300px',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: message.userId === selectedUser.id ? '#1976d2' : 'white',
                          color: message.userId === selectedUser.id ? 'white' : '#333',
                          border: message.userId === selectedUser.id ? 'none' : '1px solid #ddd'
                        }}
                      >
                        <div style={{ fontWeight: '500', fontSize: '14px', marginBottom: '4px' }}>
                          {message.userId === selectedUser.id ? 'Vous' : message.username}
                        </div>
                        <div>{message.content}</div>
                        <div style={{ 
                          fontSize: '12px', 
                          marginTop: '4px', 
                          opacity: 0.7 
                        }}>
                          {message.date && (
                            <span style={{ marginRight: '8px' }}>
                              {message.date}
                            </span>
                          )}
                          {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Élément invisible pour auto-scroll */}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ 
              padding: '1.5rem', 
              background: 'white', 
              borderTop: '1px solid #ddd' 
            }}>
              <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem' }}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Tapez votre message..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  style={{
                    background: newMessage.trim() ? '#1976d2' : '#ccc',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: newMessage.trim() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Envoyer 
                </button>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div style={{ 
            marginTop: '1rem', 
            background: '#ffebee', 
            border: '1px solid #e57373', 
            color: '#c62828', 
            padding: '12px 16px', 
            borderRadius: '8px' 
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App
