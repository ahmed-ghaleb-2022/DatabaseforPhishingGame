'use client';

import React, { useState } from 'react';

const DownloadButton = () => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/download-sqlite');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'database.db');

      // Append to the document and trigger download
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
    className='text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' 
    onClick={handleDownload} disabled={loading}>
      {loading ? 'Loading...' : 'Download the Database'}
    </button>
  );
};

export default DownloadButton;