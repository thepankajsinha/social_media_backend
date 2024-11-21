import React, { useEffect } from 'react';
import { useUserStore } from '../stores/useUserStore';

function HomePage() {
  // Destructure recommendedUsers and getRecommendedUsers from Zustand store
  const { recommendedUsers, getRecommendedUsers } = useUserStore();

  useEffect(() => {
    getRecommendedUsers();  // Fetch recommended users on component mount
  }, [getRecommendedUsers]);
  console.log(recommendedUsers)

  return (
    <div>
      <h1>HomePage</h1>
      {recommendedUsers ? (
        <div>
          <h2>Recommended Users:</h2>
          <ul>
            {recommendedUsers.map((user) => (
              <li key={user.id}>{user.name}</li> 
            ))}
          </ul>
        </div>
      ) : (
        <p>No recommended users available.</p>
      )}
    </div>
  );
}

export default HomePage;
