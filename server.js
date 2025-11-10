// server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const path = require('path');

// Load Firebase service account - replace firebase.json with your real key file
const serviceAccount = require('./firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const metrics = ['sales', 'expenses', 'profit_margin', 'profit_loss', 'purchases'];

async function getCollectionData(collectionName) {
  const snapshot = await db.collection(collectionName).orderBy('date', 'asc').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function addToCollection(collectionName, data) {
  const docRef = await db.collection(collectionName).add(data);
  return { id: docRef.id, ...data };
}

metrics.forEach(metric => {
  app.get('/api/' + metric, async (req, res) => {
    try {
      const data = await getCollectionData(metric);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/' + metric, async (req, res) => {
    try {
      const { amount, date } = req.body;
      if (amount === undefined || !date) {
        return res.status(400).json({ error: 'amount and date are required' });
      }
      const payload = { amount: Number(amount), date };
      const result = await addToCollection(metric, payload);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Financial DashboardX running on http://localhost:${PORT}`));
