import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const TableData = ({ tableName }) => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleEditColumn = async (columnName, newValue) => {
    try {
      await axios.put('http://localhost:3000/update-column', { tableName, columnName, newValue });
      fetchTableData();
    } catch (error) {
      console.error('Error updating column:', error);
    }
  };

  const handleDeleteRow = async (conditions) => {
    try {
      await axios.delete('http://localhost:3000/delete-row', { data: { tableName, conditions } });
      fetchTableData();
    } catch (error) {
      console.error('Error deleting row:', error);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setNewRowData({ ...newRowData, Path: file.name }); // Assuming the column name for images is Path
  };

  const handleInsertData = async () => {
    const formData = new FormData();
    formData.append('tableName', tableName);
    formData.append('data', JSON.stringify(newRowData));
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      await axios.post('http://localhost:3000/insert-into-table', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      handleCloseDialog();
      fetchTableData();
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  };

  const renderInputField = (column) => {
    const { Field, Type } = column;
    console.log(Type);
    switch (Type.toUpperCase()) {
     
      case 'DATE':
        return (
          <TextField
            key={Field}
            autoFocus
            margin="dense"
            label={Field}
            type="date"
            fullWidth
            variant="outlined"
            name={Field}
            value={newRowData[Field] || ''}
            onChange={handleInputChange}
            style={{ marginBottom: '10px' }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
      case 'DATETIME':
        return (
          <TextField
            key={Field}
            autoFocus
            margin="dense"
            label={Field}
            type="datetime-local"
            fullWidth
            variant="outlined"
            name={Field}
            value={newRowData[Field] || ''}
            onChange={handleInputChange}
            style={{ marginBottom: '10px' }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );
      case 'BOOLEAN':
        return (
          <TextField
            key={Field}
            autoFocus
            margin="dense"
            label={Field}
            select
            fullWidth
            variant="outlined"
            name={Field}
            value={newRowData[Field] || ''}
            onChange={handleInputChange}
            style={{ marginBottom: '10px' }}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </TextField>
        );
      case 'Path':
      case 'Image':
        return (
          <div key={Field} className="mb-4">
            <InputLabel>{Field}</InputLabel>
            <input type="file" name={Field} onChange={handleFileChange} />
          </div>
        );
      default:
        return (
          <TextField
            key={Field}
            autoFocus
            margin="dense"
            label={Field}
            fullWidth
            variant="outlined"
            name={Field}
            value={newRowData[Field] || ''}
            onChange={handleInputChange}
            style={{ marginBottom: '10px' }}
          />
        );
    }
  };

  return (
    <div className="space-y-4">
      <Button variant="outlined" onClick={handleOpenDialog}>
        + Insert Data
      </Button>
      {tableData.map((row, rowIndex) => (
        <div key={rowIndex} className="bg-gray-50 p-4 rounded-md shadow-sm">
          {columns.map((column, colIndex) => (
            <p key={colIndex} className="text-gray-700">
              <span className="font-semibold">{column.Field}:</span> {row[column.Field]}
            </p>
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
          {columns.map((column) => renderInputField(column))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleInsertData} variant="contained" color="primary">
            Insert
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TableData;
