import React, { useState, useEffect } from 'react';

interface NewsItem {
  title: string;
  publishedAt: string;
  url: string;
}

const NewsWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const newsApiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      try {
        setIsLoading(true);
        // Replace YOUR_API_KEY with your actual News API key
        const response = await fetch(`https://newsapi.org/v2/everything?q=fish+market&apiKey=${newsApiKey}&pageSize=5`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const jsonData = await response.json();
        setNews(jsonData.articles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
    </div>
  );
};

export default NewsWidget;