import React, { useState, useEffect, useCallback } from 'react';

interface NewsItem {
  title: string;
  publishedAt: string;
  url: string;
}

const NewsWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (retries = 3) => {
    const newsApiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`https://newsapi.org/v2/everything?q=fish+market&apiKey=${newsApiKey}&pageSize=5`);
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const jsonData = await response.json();
      setNews(jsonData.articles);
    } catch (err) {
      console.error('Error fetching news:', err);
      if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => fetchNews(retries - 1), 2000); // Retry after 2 seconds
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleRefresh = () => {
    fetchNews();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return (
    <div>
      <div>Error: {error}</div>
      <button onClick={handleRefresh} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {news.map((item, index) => (
        <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-2">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">
            {item.title}
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(item.publishedAt).toLocaleDateString()}</p>
        </div>
      ))}
      <button onClick={handleRefresh} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Refresh News
      </button>
    </div>
  );
};

export default NewsWidget;