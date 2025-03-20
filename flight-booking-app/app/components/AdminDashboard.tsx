import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import { getAnalytics } from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getAnalytics();
        setAnalytics(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  const { totalUsers, activeUsersToday, userSpending, totalFlightsBooked, totalEarnings, usersLast7Days, flightsLast7Days } = analytics;

  // Chart Data
  const usersLast7DaysChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [{ label: 'Users Signed Up', data: usersLast7Days, backgroundColor: 'rgba(75, 192, 192, 0.6)' }],
  };

  const flightsLast7DaysChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [{ label: 'Flights Booked', data: flightsLast7Days, borderColor: 'rgba(153, 102, 255, 1)', borderWidth: 2, fill: true }],
  };

  return (
    <div className="container mx-auto p-0 bg-[#1B1D1E] text-white min-h-[90vh]">
      <h1 className="text-xl font-bold mb-6 text-center">Analytics</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[{ label: 'Total Users', value: totalUsers }, { label: 'Active Users Today', value: activeUsersToday }, { label: 'Total Flights Booked', value: totalFlightsBooked }, { label: 'Total Earnings', value: `$${totalEarnings}` }].map(
          (item, index) => (
            <div key={index} className="bg-[#2A2C2E] p-6 shadow-md rounded-lg text-center">
              <h2 className="text-lg font-semibold mb-2">{item.label}</h2>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          )
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#2A2C2E] p-4 shadow-md rounded-lg flex flex-col items-center" style={{ height: '400px' }}>
          <h2 className="text-lg font-semibold mb-4">Users Last 7 Days</h2>
          <div className='h-[330px]'>
            <Bar data={usersLast7DaysChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-[#2A2C2E] p-4 shadow-md rounded-lg flex flex-col items-center" style={{ height: '400px' }}>
          <h2 className="text-lg font-semibold mb-4">Flights Last 7 Days</h2>
          <div className='h-[330px]'>
            <Line data={flightsLast7DaysChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
