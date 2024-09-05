import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { Line, OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PriceData } from '../../types/priceData';

extend({ OrbitControls });

interface PriceChart3DProps {
  data: PriceData[];
}

const Chart: React.FC<{ data: PriceData[] }> = ({ data }) => {
  // Cast to any to bypass the type issue

    
  if (!data || data.length === 0) {
    console.warn('No data provided for the chart.');
    return null; // Return null or a placeholder if no data
  }
  
  const lineRef = useRef<any>(null);
  const { camera } = useThree();

  const points = useMemo(() => {
    return data.map((point, index) => {
      const x = (index / (data.length - 1)) * 10 - 5; // Adjust scaling factors
      const y = (point.price / 30) * 5 - 2.5; // Ensure this brings y into view
      const z = 0;
      return new THREE.Vector3(x, y, z);
    });
  }, [data]);
  


  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.geometry.setFromPoints(points);
    }
  });

  return (
    <>
      <Line
        ref={lineRef}
        points={points}
        color="red"
        lineWidth={4}
      />
      {data.map((point, index) => (
        <Text
        key={index}
        position={[points[index].x, points[index].y, points[index].z]}
        fontSize={0.2} // Adjust this size as needed
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        ${point.price.toFixed(2)}
      </Text>
      
      ))}
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Tilapia Price Over Time
      </Text>
      <OrbitControls enableZoom={false} />
    </>
  );
};

const PriceChart3D: React.FC<PriceChart3DProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Suspense fallback={<div>Loading 3D content...</div>}>
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Chart data={data} />
        </Canvas>
  </Suspense>
    </div>
  );
};

export default PriceChart3D;
