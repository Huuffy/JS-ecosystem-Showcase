// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://127.0.0.1:5500', credentials: true })); // Adjust port if needed
app.use(express.json());

// Util helpers for JSON file handling
function readJSON(filename) {
  const filePath = path.join(__dirname, filename);
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
  const content = fs.readFileSync(filePath);
  return JSON.parse(content);
}

function writeJSON(filename, data) {
  const filePath = path.join(__dirname, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// --- TICKETS ---
app.get('/api/tickets', (req, res) => {
  const tickets = readJSON('tickets.json');
  res.json(tickets);
});

app.post('/api/tickets', (req, res) => {
  const tickets = readJSON('tickets.json');
  const newTicket = {
    id: `TKT-${Date.now()}`,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority || 'medium',
    category: req.body.category || 'General',
    status: 'open',
    assignee: 'Unassigned',
    created: new Date(),
  };
  tickets.unshift(newTicket);
  writeJSON('tickets.json', tickets);
  res.status(201).json(newTicket);
});

// --- ARTICLES ---
app.get('/api/articles', (req, res) => {
  const articles = readJSON('articles.json');
  res.json(articles);
});

app.post('/api/articles', (req, res) => {
  const articles = readJSON('articles.json');
  const newArticle = {
    id: `ART-${Date.now()}`,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author || 'Admin',
    created: new Date(),
  };
  articles.unshift(newArticle);
  writeJSON('articles.json', articles);
  res.status(201).json(newArticle);
});

// --- CHATBOT MESSAGES ---
app.get('/api/chatbot', (req, res) => {
  const messages = readJSON('chatbot_messages.json');
  res.json(messages);
});

app.post('/api/chatbot', (req, res) => {
  const messages = readJSON('chatbot_messages.json');
  const newMsg = {
    id: Date.now(),
    text: req.body.text,
    sender: req.body.sender || 'user',
    timestamp: new Date(),
  };
  messages.push(newMsg);
  writeJSON('chatbot_messages.json', messages);
  res.status(201).json(newMsg);
});

// --- ANALYTICS ---
app.get('/api/analytics', (req, res) => {
  // Return some static or computed data for the dashboard
  const analytics = {
    totalTickets: 1300,
    openTickets: 27,
    resolvedToday: 18,
    avgResponseTime: '2.1h',
    satisfaction: 89,
    ticketsLastWeek: 160,
  };
  res.json(analytics);
});

app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));
