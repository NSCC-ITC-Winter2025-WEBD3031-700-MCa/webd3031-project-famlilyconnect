"use client";

import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

const CreateEventForm = ({ familyId, familyMembers, fetchFamily, setIsCreateEventModalOpen }: { 
  familyId: string,
  familyMembers: Array<{ id: string, name: string }>,
  fetchFamily: () => void,
  setIsCreateEventModalOpen: (isOpen: boolean) => void
}) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    place: '',
    assignedTo: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/family/${familyId}/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          status: 'PENDING',
          assignedTo: formData.assignedTo || null,
          familyId,
          place: formData.place,
          date: formData.date,
          description: formData.description,
          
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      setIsCreateEventModalOpen(false);
      toast.success("successfully create new event");
      fetchFamily();
      // Reset form after successful submission
      setFormData({
        title: '',
        date: '',
        description: '',
        assignedTo: '',
        place: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formClasses = `max-w-2xl mx-auto p-8 rounded-xl shadow-lg ${
    theme === 'dark' 
      ? 'bg-gray-800 text-gray-100' 
      : 'bg-white text-gray-800 border border-gray-200'
  }`;

  const inputClasses = `w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
    theme === 'dark'
      ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 text-white'
      : 'bg-white border-gray-300 focus:ring-blue-400 text-gray-800'
  } border`;

  const labelClasses = `block font-medium mb-2 ${
    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  }`;

  const buttonClasses = `w-full py-3 px-4 rounded-lg font-medium transition-colors ${
    isSubmitting 
      ? 'bg-blue-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700'
  } text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
    theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'
  }`;

  return (
    <form onSubmit={handleSubmit} className={formClasses}>
      <h2 className="text-3xl font-bold mb-8 text-center">Create Family Event</h2>
      
      {error && (
        <div className={`mb-6 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-800'
        }`}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="title" className={labelClasses}>
            Event Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={inputClasses}
            placeholder="Family BBQ, Reunion, etc."
          />
        </div>

        <div>
          <label htmlFor="date" className={labelClasses}>
            Date and Time *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="place" className={labelClasses}>
          Location
        </label>
        <input
          type="text"
          id="place"
          name="place"
          value={formData.place}
          onChange={handleChange}
          className={inputClasses}
          placeholder="Where is the event taking place?"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className={labelClasses}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={inputClasses}
          placeholder="What's this event about? Any special instructions?"
        />
      </div>

      {/* <div className="mb-8">
        <label htmlFor="assignedTo" className={labelClasses}>
          Primary Organizer (optional)
        </label>
        <select
          id="assignedTo"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="">No one (unassigned)</option>
          {familyMembers.length > 0 &&familyMembers.map(member => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div> */}

      <input type="hidden" name="familyId" value={familyId} />

      <button
        type="submit"
        disabled={isSubmitting}
        className={buttonClasses}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Event...
          </span>
        ) : 'Create Event'}
      </button>
    </form>
  );
};

export default CreateEventForm;