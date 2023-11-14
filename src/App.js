import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file or use Styled Components

import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles
import { Button, Form, Table, Spinner, Alert } from 'react-bootstrap';

const App = () => {
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [searchFilters, setSearchFilters] = useState({});
  const [tableName, setTableName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTable = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/json_table/${tableName}`);
      const data = await response.json();

      setTableData(data);
    } catch (error) {
      setError('Error fetching table. Please try again.');
      console.error('Error fetching table:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5000/json_search/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(searchFilters).toString(),
      });

      const data = await response.json();
      setTableData(data);
    } catch (error) {
      setError('Error fetching search results. Please try again.');
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTable();
  }, [tableName]);

  const handleSearch = () => {
    fetchSearchResults();
  };

  const handleInputChange = (columnName, value) => {
    setSearchFilters({ ...searchFilters, [columnName]: value });
  };

  return (
    <div className="app-container">
      <h1 className="text-center">Table Viewer</h1>

      <Form>
        <Form.Group controlId="tableName">
          <Form.Label>Table Name:</Form.Label>
          <Form.Control
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
        </Form.Group>

        {tableData.columns.map((column) => (
          <Form.Group key={column.name} controlId={column.name}>
            <Form.Label>{column.name}:</Form.Label>
            <Form.Control
              type="text"
              value={searchFilters[column.name] || ''}
              onChange={(e) => handleInputChange(column.name, e.target.value)}
            />
          </Form.Group>
        ))}

        <Button variant="warning" onClick={handleSearch}>
          Search
        </Button>
      </Form>

      {loading && <Spinner animation="border" variant="warning" />}
      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            {tableData.columns.map((column) => (
              <th key={column.name}>{column.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default App;
