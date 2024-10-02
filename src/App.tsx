import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './pages/products/ProductList';
import AddEdit from './pages/products/AddEdit';

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/add" element={<AddEdit />} />
          <Route path="/edit/:id" element={<AddEdit />} />
        </Routes>
      </Router>
  );
};

export default App;
