import React, { useEffect, useState } from 'react';

export default function StaffList() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStaff() {
      const token = localStorage.getItem('token');

      if (!token) {
        setError("Access token not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/staff', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errMessage = await response.text();
          throw new Error(`Failed to fetch staff list: ${response.status} ${errMessage}`);
        }

        const data = await response.json();
        setStaffList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStaff();
  }, []);

  const handleDelete = async (username) => {
    const confirmed = window.confirm(`Are you sure you want to deactivate '${username}'?`);
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Access token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/staff/${username}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errMessage = await response.text();
        throw new Error(`Failed to delete staff: ${response.status} ${errMessage}`);
      }

      // Remove from UI
      setStaffList((prevList) => prevList.filter(user => user.username !== username));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading staff list...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-700">Staff Members</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Username</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.id} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-800">{staff.username}</td>
                <td className="px-6 py-4 text-sm text-gray-800 capitalize">{staff.role}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    onClick={() => handleDelete(staff.username)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
