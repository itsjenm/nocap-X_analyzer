import { useState } from 'react';
import { FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { PiBaseballCap } from "react-icons/pi";
import { FaTwitter, FaUser, FaCalendarAlt, FaHeart, FaRetweet } from 'react-icons/fa';

interface Tweet {
    text: string;
    created_at: string;
    sentiment: string;
    sentiment_score: number;
    misinfo_label: string;
    misinfo_score: number;
  }


interface UserData {
  name: string;
  username: string;
  bio: string;
  followers_count: number;
  following_count: number;
  credibility_score: number;
  tweets: { text: string; created_at: string; sentiment: string; sentiment_score: number; misinfo_label: string; misinfo_score: number; }[];
  
}

export default function TweetAnalysis() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    try {
      const response = await fetch('/api/analyze_sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setUserData(data);
      setLoading(true);
      console.log('User data:', data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };


  // Function to return the credibility icon based on score
  const getCredibilityIcon = (credibility_score: number) => {
    if (credibility_score >= 0.7) {
        return <FaSmile color="green" />;
      } else if (credibility_score >= 0.4) {
        return <FaMeh color="orange" />;
      } else {
        return <FaFrown color="red" />;
      }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center">
        <PiBaseballCap className="mr-2" />NoCap: Twitter Profile Analyzer</h2>
      <div className="mb-6">
        <input 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Twitter username..."
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
        disabled={loading}
      >
       
        {loading ? 'Loading...' : 'Search'}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {userData && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-black">User Data</h3>
          <p className='text-black'><strong>Name:</strong> {userData.name}</p>
          <p className='text-black'><strong>Username:</strong> {userData.username}</p>
          <p className='text-black'><strong>Bio:</strong> {userData.bio}</p>
          <p className='text-black'><strong>Followers:</strong> {userData.followers_count}</p>
          <p className='text-black'><strong>Following:</strong> {userData.following_count}</p>
          
          <h4 className="font-semibold text-md text-gray-800 mt-4">Credibility Score</h4>
          <div className="flex items-center space-x-2">
          <span>{getCredibilityIcon(userData.credibility_score)}</span>
            <p className="text-black">Credibility Score: {userData.credibility_score}</p>
          </div>
          
          <h4 className="font-semibold text-md text-gray-800 mt-4">Recent Tweets</h4>
          <ul>
          {userData?.tweets?.length > 0 ? (
              userData.tweets.map((tweet, index) => (
                <li key={index} className="mt-2 text-black tweet-widget">
                  <p className='text-blue-600'>{tweet.text}</p>
                  <small className='text-grey-800'><FaCalendarAlt className="mr-1" />{new Date(tweet.created_at).toLocaleString()}</small>
                  <p>
                    {tweet.sentiment === 'POSITIVE' ? <FaSmile color="green" /> : <FaFrown color="red" />}
                    <strong> Sentiment:</strong> {tweet.sentiment} ({(tweet.sentiment_score * 100).toFixed(2)}%)
                  </p>
                  <p>
                    <strong>Misinformation:</strong> {tweet.misinfo_label === 'LABEL_0' ? "Fake News" : "Real News"} ({tweet.misinfo_score})</p>
                </li>
              ))
            ) : (
              <p className='text-black'>No tweets found for this user.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
