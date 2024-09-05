// pages/api/price.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const price = {
    date: new Date().toISOString().split('T')[0],
    price: Math.random() * 10 + 20 // Random price between 20 and 30
  };

  res.status(200).json(price);
}