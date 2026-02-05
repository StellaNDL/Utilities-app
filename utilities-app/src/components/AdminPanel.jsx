import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          *,
          profiles ( email )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error("Error fetching complaints:", error.message);
      alert("Could not load data. Are you an admin?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this complaint?");
    
    if (confirmDelete) {
      try {
        const { error } = await supabase
          .from('complaints')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchComplaints(); 
        alert("Complaint deleted successfully.");
      } catch (error) {
        console.error("Error deleting:", error.message);
        alert("Failed to delete.");
      }
    }
  };
  if (loading) {
    return <div>Loading Admin Panel...</div>;
  }

  return (
    <div className="admin-container" style={{ padding: '20px' }}>
      <h2>Admin Dashboard</h2>
      
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px' }}>User Email</th>
              <th style={{ padding: '10px' }}>Complaint</th>
              <th style={{ padding: '10px' }}>Date</th>
              <th style={{ padding: '10px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td style={{ padding: '10px' }}>
                  {/* Safely get the email */}
                  {complaint.profiles ? complaint.profiles.email : "Unknown User"}
                </td>
                <td style={{ padding: '10px' }}>{complaint.content}</td>
                <td style={{ padding: '10px' }}>
                  {new Date(complaint.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px' }}>
                  {/* DELETE BUTTON */}
                  <button 
                    onClick={() => handleDelete(complaint.id)}
                    style={{ backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;


