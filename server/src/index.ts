import express from "express";
import cors from "cors";
import {Server} from "socket.io"
import {createServer} from "http"
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL || "https://your-vercel-app.vercel.app"]
      : "*",
    credentials: true
  }
});
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || "https://your-vercel-app.vercel.app"]
    : "*",
  credentials: true
}));
app.use(express.json());
let users = [
    { id: 1, name: "max", email: "max@teste.com" },
    { id: 2, name: "Nico", email: "Nico@teste.com" },
    { id: 3, name: "Marc", email: "Marc@teste.com" },
];

let messages: any[] = [];

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

app.delete("/api/messages/clear", (req, res) => {
    const { adminCode } = req.body;
    
    // Vérification du code secret côté serveur
    if (adminCode !== "Tomtom") {
        return res.status(403).json({ 
            error: 'Code administrateur incorrect' 
        });
    }
    
    messages = [];
    io.emit('messagesCleared');
    res.json({ message: 'Chat vidé avec succès', count: 0 });
});

app.post("/api/messages", (req, res) => {
    const { content, userId, username, date } = req.body;
    
    const newMessage = {
        id: messages.length + 1,
        content: content,
        userId: userId,
        username: username || "Utilisateur anonyme",
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
