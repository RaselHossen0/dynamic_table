import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data for the dashboard when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/dashboard-data');
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      {/* Display the dashboard data here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* {data.map((item, index) => ( */}
          <div  className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{data.tableCount}</h3>
          
          </div>
        {/* ))} */}
      </div>
    </div>
  );
}

export default Dashboard;
