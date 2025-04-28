// import React, { useState, useEffect } from 'react';

// export default function Inventory() {
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [updatedName, setUpdatedName] = useState('');
//   const [updatedQuantity, setUpdatedQuantity] = useState('');
//   const [updatedPrice, setUpdatedPrice] = useState('');
//   const [updatedLowStockThreshold, setUpdatedLowStockThreshold] = useState('');

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [newName, setNewName] = useState('');
//   const [newQuantity, setNewQuantity] = useState('');
//   const [newPrice, setNewPrice] = useState('');
//   const [newLowStockThreshold, setNewLowStockThreshold] = useState('');
//   const [addError, setAddError] = useState('');

//   useEffect(() => {
//     async function fetchInventory() {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/inventory/');
//         if (!response.ok) throw new Error('Failed to fetch inventory items');
//         const data = await response.json();
//         setInventoryItems(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchInventory();
//   }, []);

//   const handleDelete = async (itemId) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/inventory/${itemId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) throw new Error('Failed to delete item');

//       setInventoryItems((prevItems) => prevItems.filter(item => item.id !== itemId));
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const handleUpdate = async (itemId) => {
//     const updatedItem = {
//       name: updatedName,
//       quantity: updatedQuantity,
//       price: updatedPrice,
//       low_stock_threshold: updatedLowStockThreshold,
//     };

//     try {
//       const response = await fetch(`http://127.0.0.1:8000/inventory/${itemId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedItem),
//       });

//       if (!response.ok) throw new Error('Failed to update item');

//       setInventoryItems((prevItems) =>
//         prevItems.map((item) =>
//           item.id === itemId ? { ...item, ...updatedItem } : item
//         )
//       );
//       setSelectedItem(null);
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   const handleOpenUpdateForm = (item) => {
//     setSelectedItem(item);
//     setUpdatedName(item.name);
//     setUpdatedQuantity(item.quantity);
//     setUpdatedPrice(item.price);
//     setUpdatedLowStockThreshold(item.low_stock_threshold);
//   };

//   const handleAddItem = async (e) => {
//     e.preventDefault();
//     const exists = inventoryItems.some(item => item.name.toLowerCase() === newName.toLowerCase());
//     if (exists) {
//       setAddError('Item already exists.');
//       return;
//     }

//     const newItem = {
//       name: newName,
//       quantity: newQuantity,
//       price: newPrice,
//       low_stock_threshold: newLowStockThreshold,
//     };

//     try {
//       const response = await fetch('http://127.0.0.1:8000/inventory/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newItem),
//       });

//       if (!response.ok) throw new Error('Failed to add item');

//       const createdItem = await response.json();
//       setInventoryItems((prev) => [...prev, createdItem]);
//       setShowAddForm(false);
//     } catch (err) {
//       setAddError(err.message);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => {
//             setShowAddForm(true);
//             setNewName('');
//             setNewQuantity('');
//             setNewPrice('');
//             setNewLowStockThreshold('');
//             setAddError('');
//           }}
//           className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
//         >
//           + Add New Item
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white rounded-lg shadow-md">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="px-6 py-3 text-sm font-medium text-gray-700">Item Name</th>
//               <th className="px-6 py-3 text-sm font-medium text-gray-700">Quantity</th>
//               <th className="px-6 py-3 text-sm font-medium text-gray-700">Price</th>
//               <th className="px-6 py-3 text-sm font-medium text-gray-700">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {inventoryItems.map((item) => (
//               <tr key={item.id} className="border-b">
//                 <td className="px-6 py-4 text-base text-gray-700">{item.name}</td>
//                 <td className="px-6 py-4 text-base text-gray-700">{item.quantity}</td>
//                 <td className="px-6 py-4 text-base text-gray-700">₹{item.price.toFixed(2)}</td>
//                 <td className="px-6 py-4 text-sm space-x-4">
//                   <button
//                     className="bg-sky-200 text-black px-4 py-2 rounded-md hover:bg-sky-300"
//                     onClick={() => handleOpenUpdateForm(item)}
//                   >
//                     Update
//                   </button>
//                   <button
//                     className="bg-pink-300 text-black px-4 py-2 rounded-md hover:bg-red-400"
//                     onClick={() => handleDelete(item.id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Update Form */}
//       {selectedItem && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
//             <h3 className="text-xl font-semibold mb-4">Update Item</h3>
//             <form onSubmit={(e) => { e.preventDefault(); handleUpdate(selectedItem.id); }}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Item Name</label>
//                 <input
//                   type="text"
//                   value={updatedName}
//                   onChange={(e) => setUpdatedName(e.target.value)}
//                   className="w-full p-2 border rounded-md text-black"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Quantity</label>
//                 <input
//                   type="number"
//                   value={updatedQuantity}
//                   onChange={(e) => setUpdatedQuantity(e.target.value)}
//                   className="w-full p-2 border rounded-md text-black"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 ">Price</label>
//                 <input
//                   type="number"
//                   value={updatedPrice}
//                   onChange={(e) => setUpdatedPrice(e.target.value)}
//                   className="w-full p-2 border rounded-md text-black"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 ">Low Stock Threshold</label>
//                 <input
//                   type="number"
//                   value={updatedLowStockThreshold}
//                   onChange={(e) => setUpdatedLowStockThreshold(e.target.value)}
//                   className="w-full p-2 border rounded-md text-black"
//                 />
//               </div>
//               <div className="flex justify-end space-x-4">
//                 <button type="button" onClick={() => setSelectedItem(null)} className="px-4 py-2 bg-purple-100 rounded-md text-black">Cancel</button>
//                 <button type="submit" className="px-4 py-2 bg-yellow-100 text-black rounded-md">Save Changes</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Add New Item Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
//             <h3 className="text-xl font-semibold mb-4">Add New Item</h3>
//             <form onSubmit={handleAddItem}>
//               {addError && <div className="text-red-600 mb-2">{addError}</div>}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Item Name</label>
//                 <input
//                   type="text"
//                   value={newName}
//                   onChange={(e) => setNewName(e.target.value)}
//                   className="w-full p-2 border rounded-md text-black"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Quantity</label>
//                 <input
//                   type="number"
//                   value={newQuantity}
//                   onChange={(e) => setNewQuantity(e.target.value)}
//                   className="w-full p-2 border rounded-md text-black"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Price</label>
//                 <input
//                   type="number"
//                   value={newPrice}
//                   onChange={(e) => setNewPrice(e.target.value)}
//                   className="w-full p-2 border rounded-md text-black"
//                   required
//                 />
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
//                 <input
//                   type="number"
//                   value={newLowStockThreshold}
//                   onChange={(e) => setNewLowStockThreshold(e.target.value)}
//                   className="w-full p-2 border rounded-md text-black"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end space-x-4">
//                 <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-purple-100 rounded-md text-black">Cancel</button>
//                 <button type="submit" className="px-4 py-2 bg-yellow-100 text-black rounded-md">Add Item</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedQuantity, setUpdatedQuantity] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');
  const [updatedLowStockThreshold, setUpdatedLowStockThreshold] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newLowStockThreshold, setNewLowStockThreshold] = useState('');
  const [addError, setAddError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchInventory() {
      try {
        const response = await fetch('http://127.0.0.1:8000/inventory/');
        if (!response.ok) throw new Error('Failed to fetch inventory items');
        const data = await response.json();
        setInventoryItems(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/inventory/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      setInventoryItems((prevItems) => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      alert(error.message);
    }
  };

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

      if (!response.ok) throw new Error('Failed to update item');

      setInventoryItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, ...updatedItem } : item
        )
      );
      setSelectedItem(null);
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

  const handleAddItem = async (e) => {
    e.preventDefault();
    const exists = inventoryItems.some(item => item.name.toLowerCase() === newName.toLowerCase());
    if (exists) {
      setAddError('Item already exists.');
      return;
    }

    const newItem = {
      name: newName,
      quantity: newQuantity,
      price: newPrice,
      low_stock_threshold: newLowStockThreshold,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/inventory/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      if (!response.ok) throw new Error('Failed to add item');

      const createdItem = await response.json();
      setInventoryItems((prev) => [...prev, createdItem]);
      setShowAddForm(false);
    } catch (err) {
      setAddError(err.message);
    }
  };

  const filteredInventory = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Search Bar + Add Button */}
      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center space-x-2 w-1/2 text-gray-800">
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 rounded-4xl px-4 py-2 text-black w-full bg-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Cancel
            </button>
          )}
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            setNewName('');
            setNewQuantity('');
            setNewPrice('');
            setNewLowStockThreshold('');
            setAddError('');
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Add New Item
        </button>
      </div>

      {/* Inventory Table */}
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
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No inventory found.
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-6 py-4 text-base text-gray-700">{item.name}</td>
                  <td className="px-6 py-4 text-base text-gray-700">{item.quantity}</td>
                  <td className="px-6 py-4 text-base text-gray-700">₹{item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm space-x-4">
                    <button
                      className="bg-sky-200 text-black px-4 py-2 rounded-md hover:bg-sky-300"
                      onClick={() => handleOpenUpdateForm(item)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-pink-300 text-black px-4 py-2 rounded-md hover:bg-red-400"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Update Item Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Update Item</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(selectedItem.id); }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  className="w-full p-2 border rounded-md text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={updatedQuantity}
                  onChange={(e) => setUpdatedQuantity(e.target.value)}
                  className="w-full p-2 border rounded-md text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={updatedPrice}
                  onChange={(e) => setUpdatedPrice(e.target.value)}
                  className="w-full p-2 border rounded-md text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                <input
                  type="number"
                  value={updatedLowStockThreshold}
                  onChange={(e) => setUpdatedLowStockThreshold(e.target.value)}
                  className="w-full p-2 border rounded-md text-black"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setSelectedItem(null)} className="px-4 py-2 bg-purple-100 rounded-md text-black">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-100 text-black rounded-md">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Item</h3>
            <form onSubmit={handleAddItem}>
              {addError && <div className="text-red-600 mb-2">{addError}</div>}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full p-2 border rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full p-2 border rounded-md text-black"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Low Stock Threshold</label>
                <input
                  type="number"
                  value={newLowStockThreshold}
                  onChange={(e) => setNewLowStockThreshold(e.target.value)}
                  className="w-full p-2 border rounded-md text-black"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-purple-100 rounded-md text-black">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-yellow-100 text-black rounded-md">Add Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
