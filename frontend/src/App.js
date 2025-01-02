import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from "./components/ui/Button";

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // ดึงข้อมูลจาก Django API
    axios.get('http://localhost:8000/api/mydata/')
      .then(response => {
        setData(response.data); // ตั้งค่าข้อมูลที่ได้
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div>
      <h1>Django API Data</h1>
      {data ? <p>{data.message}</p> : <p>Loading...</p>}

      <h1 className="text-2xl font-bold mb-4">Hello TailwindCSS</h1>
      <Button variant="default">Primary Button</Button>
      <Button variant="outline">Outline Button</Button>

      <Button className="bg-red-500 text-white hover:bg-red-600">
        Custom Button
      </Button>

      <h1 className="text-4xl text-red-500">Test Tailwind</h1>

    </div>
  );
};

export default App;
