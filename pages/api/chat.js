import OpenAI from "openai";
import clientPromise from '../../utils/mongodb';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { messages } = req.body;

      // Connect to MongoDB and fetch team member, deal, and note data
      const client = await clientPromise;
      const db = client.db('ise_chatbot');
      const teamMembers = await db.collection('team_members').find({}).toArray();
      const deals = await db.collection('deals').find({}).toArray();
      const notes = await db.collection('notes').find({}).toArray();

      // Prepare team member information for the chatbot
      const teamMemberInfo = teamMembers.map(member => 
        `Name: ${member.name}, Title: ${member.title}, Email: ${member.email}`
      ).join('\n');

      // Prepare deal information for the chatbot
      const dealInfo = deals.map(deal => 
        `School: ${deal.school}, Sport: ${deal.sport}, Length: ${deal.length} years, Annual Amount: $${deal.annualAmount.toLocaleString()}`
      ).join('\n');

      // Prepare note information for the chatbot
      const noteInfo = notes.map(note => 
        `Title: ${note.title}, Content: ${note.content}, Importance: ${note.importance}`
      ).join('\n');

      // Add team member, deal, and note information to the system message
      const systemMessage = {
        role: "system",
        content: `You are an assistant for ISE looking to engage with potential brand prospects to sponsor naming rights of an ISE premium property. Here's information about our team members:
          ${teamMemberInfo}

          And here's information about our deals:
          ${dealInfo}

          And here are some notes:
          ${noteInfo}

          Use this information to answer questions about ISE, our team and the deals we've made. Use natural language to explain the info instead of raw data. Keep replies concise and conversational. If the user asks something off topic, shift the conversation back to ISE and don't engage with other subjects. Instead of long answers to questions, respond ' would you like to hear more' before you ramble.`
      };

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [systemMessage, ...messages],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      res.status(200).json({ response: response.choices[0].message.content });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}