import React, { useState, useEffect } from 'react';

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // Store selected item for updating
  const [updatedName, setUpdatedName] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedLowStockThreshold, setUpdatedLowStockThreshold] = useState('');

  // Fetch inventory items from the backend API
  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch('http://127.0.0.1:8000/inventory/');
        if (!response.ok) {
          throw new Error('Failed to fetch inventory items');
        }
        const data = await response.json();
        setInventoryItems(data);  // Assuming the response is an array of items
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  // Function to handle the delete action
  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/inventory/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Remove the deleted item from the state
      setInventoryItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      alert(error.message);
    }
  };

  // Function to handle the update action
  const handleUpdate = async (itemId) => {
    const updatedItem = {
      name: updatedName,
      quantity: updatedQuantity,
      price: updatedPrice,
      low_stock_threshold: updatedLowStockThreshold,
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000/inventory/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      // Update the inventory list after successful update
      setInventoryItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, ...updatedItem } : item
        )
      );
      setSelectedItem(null); // Close the update form/modal
    } catch (error) {
      alert(error.message);
    }
  };

  const handleOpenUpdateForm = (item) => {
    setSelectedItem(item);
    setUpdatedName(item.name);
    setUpdatedQuantity(item.quantity);
    setUpdatedPrice(item.price);
    setUpdatedLowStockThreshold(item.low_stock_threshold);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="px-6 py-3 text-sm font-medium text-gray-700">Item Name</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700">Quantity</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700">Price</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-6 py-4 text-sm text-gray-700">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-700">${item.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm space-x-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() => handleOpenUpdateForm(item)}  // Open the update form
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update form/modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Update Item</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(selectedItem.id); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  id="name"
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter item name"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  id="quantity"
                  type="number"
                  value={updatedQuantity}
                  onChange={(e) => setUpdatedQuantity(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  id="price"
                  type="number"
                  value={updatedPrice}
                  onChange={(e) => setUpdatedPrice(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter price"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="low_stock_threshold" className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                <input
                  id="low_stock_threshold"
                  type="number"
                  value={updatedLowStockThreshold}
                  onChange={(e) => setUpdatedLowStockThreshold(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter low stock threshold"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}  // Close form
                  className="px-4 py-2 bg-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
