import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TableData from './TableData';

const AddTables = () => {
  const [tables, setTables] = useState([]);
  const [activeTable, setActiveTable] = useState('');
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([{ name: '', type: 'INT' }]); // Example initialization
  const [message,setMessage]=useState('');
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get('http://localhost:3000/show-tables');
        setTables(response.data);
        if (response.data.length > 0) {
          setActiveTable(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch tables:', error);
      }
    };

    fetchTables();
  }, []);

  const handleTableNameChange = (e) => {
    setTableName(e.target.value);
  };

  const handleColumnChange = (index, e) => {
    const newColumns = [...columns];
    newColumns[index][e.target.name] = e.target.value;
    setColumns(newColumns);
  };

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'INT' }]); // Adds a new column with default values
  };

 

const handleSubmit = async (e) => {
  e.preventDefault();



  try {
    const response = await axios.post('http://localhost:3000/create-table', { tableName, columns });
    console.log(response.data); // Success response from server
    setMessage(response.data);
    setActiveTable('');
    setTimeout(() => {
        setMessage('');
      }, 3000);
  } catch (error) {
    setMessage(`Error creating table. Please try again.${error.message}`);
    setActiveTable('');
    setTimeout(() => {
      setMessage('');
    }, 3000);
    console.error('Error creating table:', error.response ? error.response.data : error.message);
  }
};
  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index)); // Removes the column at the specified index
  };
  return (
    <div>
      <div className="flex space-x-2 border-b">
        {tables.map((table) => (
          <button
            key={table}
            className={`py-2 px-4 text-sm ${activeTable === table ? 'font-bold border-b-2 border-blue-500' : 'text-gray-600'}`}
            onClick={() => setActiveTable(table)}
          >
            {table}
          </button>
        ))}
        <button className="py-2 px-4 text-sm text-blue-600" onClick={() => setActiveTable('create')}>+ Create Table</button>
      </div>
      {message && (
  <div className="p-4 mt-2 text-center text-white bg-green-500 rounded-lg shadow-md">
    {message}
  </div>
)}
      <div className="p-4">
        {activeTable === 'create' ? (
         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
         <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
           <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Table</h3>
           <form className="mt-2 space-y-4" onSubmit={handleSubmit}>
             <div>
               <label className="block text-sm font-medium text-gray-700">Table Name:</label>
               <input
                 type="text"
                 value={tableName}
                 onChange={handleTableNameChange}
                 className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
               />
             </div>
             {columns.map((column, index) => (
               <div key={index} className="flex space-x-2">
                 <input
                   type="text"
                   name="name"
                   value={column.name}
                   onChange={(e) => handleColumnChange(index, e, 'name')}
                   placeholder="Column Name"
                   className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                 />
                <select
  name="type"
  value={column.type}
  onChange={(e) => handleColumnChange(index, e, 'type')}
  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
  <option value="INT">INT</option>
  <option value="VARCHAR">VARCHAR</option>
  <option value="CHAR">CHAR</option>
  <option value="TEXT">TEXT</option>
  <option value="BLOB">BLOB</option>
  <option value="DATE">DATE</option>
  <option value="TIME">TIME</option>
  <option value="DATETIME">DATETIME</option>
  <option value="TIMESTAMP">TIMESTAMP</option>
  <option value="YEAR">YEAR</option>
  <option value="BOOLEAN">BOOLEAN</option>
  <option value="DECIMAL">DECIMAL</option>
  <option value="FLOAT">FLOAT</option>
  <option value="DOUBLE">DOUBLE</option>
  <option value="BIT">BIT</option>
  <option value="ENUM">ENUM</option>
  <option value="SET">SET</option>
  <option value="MEDIUMINT">MEDIUMINT</option>
  <option value="BIGINT">BIGINT</option>
  <option value="TINYINT">TINYINT</option>
  <option value="SMALLINT">SMALLINT</option>
  <option value="MEDIUMTEXT">MEDIUMTEXT</option>
  <option value="LONGTEXT">LONGTEXT</option>
  <option value="TINYTEXT">TINYTEXT</option>
  <option value="VARBINARY">VARBINARY</option>
  <option value="BINARY">BINARY</option>
  <option value="MEDIUMBLOB">MEDIUMBLOB</option>
  <option value="LONGBLOB">LONGBLOB</option>
  <option value="TINYBLOB">TINYBLOB</option>
  <option value="JSON">JSON</option>
</select>
                 <button
      type="button"
      onClick={() => removeColumn(index)}
      className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 focus:outline-none"
    >
      Remove
    </button>
               </div>
             ))}
             <button type="button" onClick={addColumn} className="mt-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
               Add Column
             </button>
             <button type="button" onClick={() => setActiveTable('')} className="mt-3 ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
               Cancel
             </button>
             <div className="mt-5 sm:mt-6">
               <button type="submit" className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">
                 Create Table
               </button>
             </div>
           </form>
         </div>
       </div>
        ) : (
          <TableData tableName={activeTable} />
        )}
      </div>
    </div>
  );
};

export default AddTables;