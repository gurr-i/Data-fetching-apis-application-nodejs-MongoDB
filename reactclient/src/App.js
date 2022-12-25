import React, { useState, useEffect } from "react";
import "./components/List.css";

function App() {
  const [data, setData] = useState({});

  useEffect(() => {
    // Make a request to the Node.js API
    fetch("http://localhost:5000/get_data_api")
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        // console.log(data);
      });
  }, [data]);
  // If you do not want the effect to be re-run when the value of data changes, you can leave the dependencies array empty:

  if (!data) {
    return <p>Loading... Data not received by api</p>;
  }

  // converting Data to JavaScript arrays
  const dataArray = Object.values(data); // [1, 2, 3]

  return (
    <ul className="list">
      {dataArray.map((item) => (
        <li key={item._id} className="list-item">
          {item.ts}
        </li>
      ))}
    </ul>
  );
}

export default App;
