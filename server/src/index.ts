import express from "express";
import cors from "cors";
import {Server} from "socket.io"
import {createServer} from "http"
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io= new Server(server, {cors: {origin: "*"}});
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
let users = [
    { id: 1, name: "max", email: "max@teste.com" },
    { id: 2, name: "Nico", email: "Nico@teste.com" },
    { id: 3, name: "Marc", email: "Marc@teste.com" },
];

let messages = [
    { 
        id: 1,
        content: "bonjour tout le monde",
        userId: 2,
        username: "Nico",
        timestamp: "2025-01-01T10:00:00Z"
    },
    { 
        id: 2,
        content: "Hi",
        userId: 1,
        username: "max",
        timestamp: "2025-01-01T10:05:00Z"
    },
    { 
        id: 3,
        content: "Tout vas bien ?",
        userId: 3,
        username: "Marc",
        timestamp: "2025-01-01T10:10:00Z"
    }
];

app.get('/', (req, res) => {
  res.json({
    message: 'Serveur de messagerie démarré !',
    status: 'En ligne',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/users', (req, res) => {  
    res.json(users);
});

app.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.find((u) => u.id == Number(id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "Utilisateur non trouvé" });
    }
});

app.post("/api/users", (req, res) => {
    const { name, email } = req.body;
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
    };
    users.push(newUser);
    res.json(newUser);
});

app.get('/api/messages', (req,res)=>{
    res.json(messages);
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "API fonctionnelle",
        uptime: process.uptime(),
    });
});

app.post("/api/messages", (req, res) => {
    const { content, userId, date } = req.body;
    const user = users.find(u => u.id == userId);
    const username = user ? user.name : "Utilisateur inconnu";
    
    const newMessage = {
        id: messages.length + 1,
        content: content,
        userId: userId,
        username: username,
        timestamp: new Date().toISOString(),
        date: date
    };
   
    messages.push(newMessage);
    io.emit('newMessage', newMessage);
    res.json({ message: 'Message créé!', data: newMessage });
});

io.on('connection', (socket) => {
    socket.on('disconnect', () => {
    });
});

server.listen(PORT, () => {
});

export default app;
