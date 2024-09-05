import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import WebSocketService from '../../lib/websocketService';
import CacheService from '../../lib/cacheService';
import { PriceData } from '../../types/priceData';

const CACHE_KEY = 'tilapia_price_data';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

const PriceChart: React.FC = () => {
  const [data, setData] = useState<PriceData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [timeframe, setTimeframe] = useState('1d');

  const handleDataUpdate = useCallback((newData: PriceData) => {
    setData(prevData => {
      const updatedData = [...prevData, newData].slice(-100); // Keep last 100 points
      CacheService.setItem(CACHE_KEY, updatedData, CACHE_TTL);
      return updatedData;
    });
    setIsConnected(true);
  }, []);

  useEffect(() => {
    const cachedData = CacheService.getItem(CACHE_KEY);
    if (cachedData) {
      setData(cachedData);
    }

    const websocketService = WebSocketService.getInstance('/api/socketio');
    websocketService.addMessageHandler(handleDataUpdate);
    websocketService.connect();

    return () => {
      websocketService.removeMessageHandler(handleDataUpdate);
    };
  }, [handleDataUpdate]);

  const filteredData = useCallback(() => {
    const now = new Date();
    const timeframeMap = {
      '1d': 24 * 60 * 60 * 1000,
      '1w': 7 * 24 * 60 * 60 * 1000,
      '1m': 30 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
    };
    const timeframeMs = timeframeMap[timeframe as keyof typeof timeframeMap];
    return data.filter(item => new Date(item.date).getTime() > now.getTime() - timeframeMs);
  }, [data, timeframe]);

  const latestPrice = data[data.length - 1]?.price || 0;
  const priceChange = data.length > 1 ? latestPrice - data[data.length - 2].price : 0;
  const priceChangePercentage = data.length > 1 ? (priceChange / data[data.length - 2].price) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Tilapia Price Chart</CardTitle>
            <CardDescription>Real-time price tracking from major fish markets</CardDescription>
          </div>
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold">${latestPrice.toFixed(2)}</p>
            <p className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {priceChange >= 0 ? '▲' : '▼'} ${Math.abs(priceChange).toFixed(2)} ({priceChangePercentage.toFixed(2)}%)
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Status: {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={filteredData()}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="price" stroke="#8884d8" fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PriceChart;