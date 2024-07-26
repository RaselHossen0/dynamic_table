import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorDialog from '../dialogs/ErrorDialog';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,FormControl,InputLabel,Select,MenuItem
} from '@mui/material';
import { FaEdit } from 'react-icons/fa';

const TableData = ({ tableName }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [editColumnId, setEditColumnId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [newColumnName, setNewColumnName] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [originalColumnName, setOriginalColumnName] = useState('');
  const [currentColumnType, setCurrentColumnType] = useState('');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  

  const handleEditColumnExisting = (column) => {
    setOriginalColumnName(column.Field); // Assuming 'Field' is the column name property
    setCurrentColumn(column);
    setCurrentColumnType(column.Type); // Assuming 'Type' is the column type property
    setIsEditDialogOpen(true);
    setIsAddingColumn(false);
  };

  const handleColumnTypeChange = (event) => {
    setCurrentColumnType(event.target.value);
  };
  const handleAddColumn = () => {
    setCurrentColumn({ Field: '' });
    setCurrentColumnType('');
    setIsEditDialogOpen(true);
    setIsAddingColumn(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const saveColumnEdit = async () => {
    try {
      if (isAddingColumn) {
        // Add column logic
        await axios.post('http://localhost:3000/add-column', {
          tableName,
          columnName: currentColumn.Field,
          columnType: currentColumnType // Use the current column type
        });
      } else {
        // Save column edit logic
        await axios.put('http://localhost:3000/edit-column', {
          tableName,
          oldColumnName: originalColumnName, // Use the stored original column name
          newColumnName: currentColumn.Field,
          newColumnType: currentColumnType // Use the current column type
        });
      }
      setIsEditDialogOpen(false);
      fetchTableColumns();
    } catch (error) {
      console.error('Error saving column edit:', error);
      // Handle error appropriately, e.g., show a notification to the user
    }
  };

  useEffect(() => {
    fetchTableData();
    fetchTableColumns();
  }, [tableName]);

  const fetchTableData = async () => {
    try {
      const response = await axios.post('http://localhost:3000/get-data', { tableName });
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  const fetchTableColumns = async () => {
    try {
      const response = await axios.post('http://localhost:3000/show-columns', { tableName });
      setColumns(response.data);
    } catch (error) {
      console.error('Error fetching table columns:', error);
    }
  };



  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleEditColumn = async (columnName, newValue) => {
    try {
      const response = await fetch('/edit-row-field', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: row.id, columnName, newValue }),
      });
      if (response.ok) {
        console.log('Column edited successfully');
      } else {
        console.error('Failed to edit column');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteRow = async ({ id }) => {
    try {
      const response = await fetch('/delete-row', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        console.log('Row deleted successfully');
      } else {
        console.error('Failed to delete row');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewRowData({});
    setSelectedImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData({ ...newRowData, [name]: value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };
  const handleInsertData = async () => {
    const data = new FormData();
    data.append('tableName', tableName);
  
    for (const key in newRowData) {
      data.append(key, newRowData[key]);
    }
  
    if (selectedImage) {
      data.append('image', selectedImage);
    }
  
    console.log(selectedImage);
    console.log(data);
  
    try {
      await axios.post('http://localhost:3000/insert-into-table', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleCloseDialog();
      fetchTableData();
    } catch (error) {
      console.error('Error inserting data:', error);
      setErrorMessage('Error inserting data: ' + error.message);
      setErrorDialogOpen(true);
    }
  };
  
  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  return (
    <div className="space-y-4">
            <ErrorDialog open={errorDialogOpen} handleClose={handleCloseErrorDialog} errorMessage={errorMessage} />

      <div className="flex flex-row justify-between items-center p-4 bg-gray-200 rounded-md">
        <div className='flex'>
          <span className="font-semibold text-gray-700">Table Columns:</span>
          {columns.map((column, index) => (
            <div key={index} className="ml-2 p-2 bg-gray-100 rounded-md shadow-sm flex items-center justify-between">
              <span className="text-gray-600">{column.Field}</span>
              <button
                className="bg-blue-700 text-white p-1 rounded m-1"
                onClick={() => handleEditColumnExisting(column)}
              >
                <FaEdit />
              </button>
            </div>
          ))}
        </div>
      
        <Button variant="outlined" onClick={handleAddColumn}>+ Add Column</Button>
      </div>
      <Button variant="outlined" onClick={handleOpenDialog}>
        + Insert Data
      </Button>
      {tableData.map((row, rowIndex) => (
        <div key={rowIndex} className="bg-gray-50 p-4 rounded-md shadow-sm">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="text-gray-700">
              <span className="font-semibold">{column.Field}:</span>
              {column.Field === 'Path' || column.Field === 'Image' ? (
                <a href={row[column.Field]} target="_blank" rel="noopener noreferrer">
                  View Image
                </a>
              ) : (
                row[column.Field]
              )}
            </div>
          ))}
          <div className="mt-2 flex space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
              onClick={() => handleEditColumn('columnName', 'newValue')}
            >
              Edit
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded"
              onClick={() => handleDeleteRow({ id: row.id })}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      {/* Dialog for inserting data */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Add New Row</DialogTitle>
        <DialogContent>
          {columns.map((column, index) => (
            column.Field === 'Path' || column.Field === 'Image' ? (
              <input
                key={index}
                type="file"
                name={column.Field}
                onChange={handleImageChange}
                style={{ marginBottom: '10px' }}
              />
            ) : (
              <TextField
                key={index}
                autoFocus
                margin="dense"
                label={column.Field}
                fullWidth
                variant="outlined"
                name={column.Field}
                value={newRowData[column.Field] || ''}
                onChange={handleInputChange}
                style={{ marginBottom: '10px' }}
              />
            )
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleInsertData} variant="contained" color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for editing/adding column */}
      {isEditDialogOpen && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2>{isAddingColumn ? 'Add Column' : 'Edit Column'}</h2>
            <TextField
              autoFocus
              margin="dense"
              label="Column Name"
              fullWidth
              variant="outlined"
              value={currentColumn.Field}
              onChange={(e) => setCurrentColumn({ ...currentColumn, Field: e.target.value })}
              style={{ marginBottom: '10px' }}
            />
            <FormControl fullWidth>
      <InputLabel id="column-type-label">Column Type</InputLabel>
      <Select
        labelId="column-type-label"
        value={currentColumnType}
        onChange={(e) => setCurrentColumnType(e.target.value)}
        label="Column Type"
      >
        <MenuItem value="VARCHAR(255)">VARCHAR(255)</MenuItem>
        <MenuItem value="INT">INT</MenuItem>
        <MenuItem value="TEXT">TEXT</MenuItem>
        <MenuItem value="DATE">DATE</MenuItem>
        {/* Add more column types as needed */}
      </Select>
    </FormControl>
            <Button onClick={closeEditDialog}>Cancel</Button>
            <Button onClick={saveColumnEdit} variant="contained" color="primary">
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableData;