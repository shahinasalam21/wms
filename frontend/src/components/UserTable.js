import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    // Example user data (Replace with API call if needed)
    setUsers([
      { id: 1, name: "Merlin", email: "merlin@gmail.com", role: "user" },
      { id: 2, name: "Maria", email: "maria@gmail.com", role: "user" },
      { id: 3, name: "John Doe", email: "john@example.com", role: "employee" },
      { id: 4, name: "Jane Smith", email: "jane@example.com", role: "employee" },
      { id: 5, name: "Merley", email: "merley38@gmail.com", role: "manager" },
      { id: 6, name: "Alex", email: "alex@gmail.com", role: "employee" },
      { id: 7, name: "Chris", email: "chris@gmail.com", role: "user" },
    ]);
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const exportCSV = () => {
    const csv = ["ID,Name,Email,Role", ...users.map(user => `${user.id},${user.name},${user.email},${user.role}`)].join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
  };

  return (
    <Card className="p-6 shadow-xl rounded-2xl">
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center border rounded px-3 py-1">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none"
            />
          </div>
          <Button onClick={exportCSV} variant="outline" className="flex gap-2">
            <Download size={18} /> Export CSV
          </Button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <motion.tr
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <td className="p-2">{user.id}</td>
                <td className="p-2 font-medium">{user.name}</td>
                <td className="p-2 text-blue-600">{user.email}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded-full text-white text-xs ${
                      user.role === "manager"
                        ? "bg-purple-500"
                        : user.role === "employee"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTable;