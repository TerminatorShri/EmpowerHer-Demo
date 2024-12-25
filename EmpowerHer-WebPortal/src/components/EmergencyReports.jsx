import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { ToastContainer, toast } from 'react-toastify';
import { io } from 'socket.io-client'; 
import "react-toastify/dist/ReactToastify.css";

function EmergencyReports() {
  const [sosButtonReports, setSOSButtonReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // State for filtering

  useEffect(() => {
    // Fetch incidents from Firestore
    const fetchSOSEmergencyReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sosButtonReports'));
        const emergencyReportsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            reportedAt: data.reportedAt ? data.reportedAt.toDate().toLocaleString() : 'Unknown' // Convert Firestore timestamp
          };
        });
        setSOSButtonReports(emergencyReportsList);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSOSEmergencyReports();
  }, []);

  useEffect(() => {
    const socket = io("http://:8000");

    socket.on('showNotification', () => { 
      toast.success("Socket connected...");
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Apply filter based on the status
  const filteredReports = sosButtonReports.filter((report) => {
    return filter === 'all' || report.status === filter;
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Incidents</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {filteredReports.map((report) => (
            <li key={report.id} className="mb-4 p-4 bg-gray-100 rounded shadow">
              <h3 className="text-lg font-bold">{report.reportedAt}</h3>
              <p className="text-gray-700">Location: <a href={report.location} target="_blank" rel="noopener noreferrer">{report.location}</a></p>
              <p className="text-gray-700">Report To: {report.reportTo}</p>
              <p className="text-sm text-gray-500">Status: {report.status}</p>
            </li>
          ))}
        </ul>
      )}

      <ToastContainer />
    </div>
  );
}

export default EmergencyReports;
