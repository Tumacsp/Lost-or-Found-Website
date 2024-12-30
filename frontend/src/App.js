import React, { useEffect, useState } from 'react';
import axios from 'axios'; // ติดตั้ง axios ด้วย npm install axios

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
    </div>
  );
};

export default App;
