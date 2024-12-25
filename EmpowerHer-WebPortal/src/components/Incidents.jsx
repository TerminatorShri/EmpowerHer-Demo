import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // Filter state for "all", "pending", or "completed"

  useEffect(() => {
    // Fetch incidents from Firestore
    const fetchIncidents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'incidentReports'));
        const incidentsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })); // Spread doc data to include title, location, reportTo, and status
        setIncidents(incidentsList);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  // Apply filter based on the status
  const filteredIncidents = incidents.filter((incident) => {
    return incident.status == 'completed';
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Incidents</h2>

      {/* Filter buttons */}
      {/* <div className="mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 mr-2 font-semibold rounded ${filter === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 mr-2 font-semibold rounded ${filter === 'pending' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 font-semibold rounded ${filter === 'completed' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
        >
          Completed
        </button>
      </div> */}

      {/* Incident list */}
      <ul>
        {filteredIncidents.map((incident) => (
          <li key={incident.id} className="mb-4 p-4 bg-gray-100 rounded shadow">
            <h3 className="text-lg font-bold">{incident.title}</h3>
            <p className="text-gray-700">Location: {incident.location}</p>
            <p className="text-gray-700">Report To: {incident.reportTo}</p>
            <p className="text-sm text-gray-500">Status: {incident.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Incidents;
