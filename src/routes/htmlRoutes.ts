import path from 'path';
import express from 'express';

const router = express.Router();

// Route to serve the index.html file
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

export default router;
