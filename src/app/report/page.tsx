"use client";

import React, { useState } from 'react';

const report = () => {
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/report-inaccuracy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setDescription('');
      } else {
        const errorData = await response.json();
        setSubmissionStatus('error');
        setErrorMessage(errorData?.message || 'Failed to submit report.');
      }
    } catch (error: any) {
      setSubmissionStatus('error');
      setErrorMessage('An unexpected error occurred.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Report Inaccurate Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
            Description of Inaccuracy:
          </label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
          {submissionStatus === 'success' && (
            <p className="text-green-500 text-sm italic">Report submitted successfully!</p>
          )}
          {submissionStatus === 'error' && (
            <p className="text-red-500 text-sm italic">{errorMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default report;