// pages/forms.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import TeamForm from '../components/TeamForm';
import DealForm from '../components/DealForm';
import NoteForm from '../components/NoteForm';

export default function Forms() {
  const [activeForm, setActiveForm] = useState('team');
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    title: '',
    email: '',
  });
  const [dealFormData, setDealFormData] = useState({
    school: '',
    sport: 'football',
    length: '',
    annualAmount: '',
  });
  const [noteFormData, setNoteFormData] = useState({
    title: '',
    content: '',
    importance: '1',
  });
  const [message, setMessage] = useState('');

  const handleTeamChange = (e) => {
    setTeamFormData({
      ...teamFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDealChange = (e) => {
    setDealFormData({
      ...dealFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNoteChange = (e) => {
    setNoteFormData({
      ...noteFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const category = activeForm;
    const data = category === 'team' ? teamFormData : category === 'deal' ? dealFormData : noteFormData;

    try {
      const response = await fetch('/api/add-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, data }),
      });
      const responseData = await response.json();
      if (response.ok) {
        setMessage(`${category.charAt(0).toUpperCase() + category.slice(1)} added successfully!`);
        if (category === 'team') {
          setTeamFormData({ name: '', title: '', email: '' });
        } else if (category === 'deal') {
          setDealFormData({ school: '', sport: 'football', length: '', annualAmount: '' });
        } else {
          setNoteFormData({ title: '', content: '', importance: '1' });
        }
      } else {
        setMessage('Error: ' + responseData.error);
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Add Team Member, Deal, or Note - ISE Chatbot</title>
      </Head>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setActiveForm('team')}
                className={`px-4 py-2 rounded ${activeForm === 'team' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
              >
                Add Team Member
              </button>
              <button
                onClick={() => setActiveForm('deal')}
                className={`px-4 py-2 rounded ${activeForm === 'deal' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
              >
                Add Deal
              </button>
              <button
                onClick={() => setActiveForm('note')}
                className={`px-4 py-2 rounded ${activeForm === 'note' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
              >
                Add Note
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeForm === 'team' && <TeamForm formData={teamFormData} handleChange={handleTeamChange} />}
              {activeForm === 'deal' && <DealForm formData={dealFormData} handleChange={handleDealChange} />}
              {activeForm === 'note' && <NoteForm formData={noteFormData} handleChange={handleNoteChange} />}
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {activeForm === 'team' ? 'Add Team Member' : activeForm === 'deal' ? 'Add Deal' : 'Add Note'}
              </button>
            </form>
            
            {message && (
              <div className="mt-4 text-center text-sm font-medium text-green-600">
                {message}
              </div>
            )}
            <div className="mt-6 text-center">
              <Link href="/" className="text-blue-500 hover:text-blue-600">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}