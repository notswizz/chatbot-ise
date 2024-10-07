import clientPromise from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { category, data } = req.body;

      const client = await clientPromise;
      const db = client.db('ise_chatbot');

      let collection;
      if (category === 'team') {
        collection = db.collection('team_members');
        await collection.insertOne({
          name: data.name,
          title: data.title,
          email: data.email,
          createdAt: new Date()
        });
        res.status(200).json({ message: 'Team member added successfully' });
      } else if (category === 'deal') {
        collection = db.collection('deals');
        await collection.insertOne({
          school: data.school,
          sport: data.sport,
          length: parseInt(data.length),
          annualAmount: parseFloat(data.annualAmount),
          createdAt: new Date()
        });
        res.status(200).json({ message: 'Deal added successfully' });
      } else if (category === 'note') {
        collection = db.collection('notes');
        await collection.insertOne({
          title: data.title,
          content: data.content,
          importance: parseInt(data.importance),
          createdAt: new Date()
        });
        res.status(200).json({ message: 'Note added successfully' });
      } else {
        res.status(400).json({ error: 'Invalid category' });
      }
    } catch (error) {
      console.error('Error adding entry:', error);
      res.status(500).json({ error: 'An error occurred while adding entry' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}