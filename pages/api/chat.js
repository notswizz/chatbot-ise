import OpenAI from "openai";
import clientPromise from '../../utils/mongodb';
import { ObjectId } from 'mongodb';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { messages, userName, conversationId } = req.body;

      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db('ise_chatbot');

      // Fetch necessary data from the database
      const teamMembers = await db.collection('team_members').find().toArray();
      const deals = await db.collection('deals').find().toArray();
      const notes = await db.collection('notes').find().toArray();

      // Format the data for the system message
      const teamMemberInfo = teamMembers.map(member => `${member.name}, ${member.title}`).join('; ');
      const dealInfo = deals.map(deal => `${deal.school} - ${deal.sport}`).join('; ');
      const noteInfo = notes.map(note => `${note.title}: ${note.content}`).join('; ');

      // Prepare system message
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

      // Get AI response
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [systemMessage, ...messages],
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const aiMessage = { role: "assistant", content: response.choices[0].message.content };

      let convId = conversationId;
      if (convId) {
        // Update existing conversation with new messages
        await db.collection('conversations').updateOne(
          { _id: new ObjectId(convId) },
          { $addToSet: { messages: { $each: [...messages, aiMessage] } } } // Use $addToSet to avoid duplicates
        );
      } else {
        // Check if a conversation already exists for the user
        const existingConversation = await db.collection('conversations').findOne({ userName });

        if (existingConversation) {
          // Append messages to the existing conversation
          await db.collection('conversations').updateOne(
            { _id: existingConversation._id },
            { $addToSet: { messages: { $each: [...messages, aiMessage] } } } // Use $addToSet to avoid duplicates
          );
          convId = existingConversation._id;
        } else {
          // Create a new conversation if no existing conversation is found
          const result = await db.collection('conversations').insertOne({
            userName,
            messages: [...messages, aiMessage],
            createdAt: new Date()
          });
          convId = result.insertedId;
        }
      }

      res.status(200).json({ response: aiMessage.content, conversationId: convId });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}