// components/dashboard/PriceChart.tsx
import React, { useState, useEffect, useRef } from 'react'
import ReactECharts from 'echarts-for-react'
import { io, Socket } from 'socket.io-client'

interface PriceData {
  date: string
  price: number
}

const PriceChart: React.FC = () => {
  const [data, setData] = useState<PriceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch('/api/socketio')
      socketRef.current = io({
        path: '/api/socketio',
      })

      socketRef.current.on('connect', () => {
        console.log('WebSocket connected')
        setIsLoading(false)
      })

      socketRef.current.on('price-update', (newData: PriceData) => {
        console.log('Received price update:', newData)
        setData(prevData => {
          const updatedData = [...prevData, newData]
          if (updatedData.length > 30) {
            updatedData.shift()
          }
          return updatedData
        })
      })

      socketRef.current.on('disconnect', () => {
        console.log('WebSocket disconnected')
      })

      socketRef.current.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err)
        setError('Failed to connect to WebSocket server')
        setIsLoading(false)
      })
    }

    socketInitializer()

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  if (isLoading) return <div>Loading... Attempting to connect to WebSocket server.</div>
  if (error) return <div>Error: {error}</div>

  const option = {
    xAxis: {
      type: 'category',
      data: data.map(item => item.date),
    },
    yAxis: {
      type: 'value',
      name: 'Price ($)',
    },
    series: [
      {
        data: data.map(item => item.price),
        type: 'line',
        smooth: true,
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
    animation: true,
  }

  return (
    <div className="h-[300px] w-full">
      <ReactECharts
        option={option}
        style={{ height: '100%', width: '100%' }}
        notMerge={true}
        lazyUpdate={true}
      />
      <div>Connected: {socketRef.current && socketRef.current.connected ? 'Yes' : 'No'}</div>
      <div>Last update: {data.length > 0 ? data[data.length - 1].date : 'No updates yet'}</div>
    </div>
  )
}

export default PriceChart