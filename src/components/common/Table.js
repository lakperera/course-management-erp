// src/components/common/Table.js
import React, { useState } from 'react';
import Icons from '../ui/Icons';

const Table = ({ 
  headers, 
  data, 
  actions = null,
  searchable = false,
  sortable = false,
  pagination = false,
  itemsPerPage = 10,
  className = '',
  emptyMessage = 'No data available'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = searchable 
    ? data.filter(row =>
        row.some(cell => 
          cell?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // Sort data
  const sortedData = sortable && sortConfig.key !== null
    ? [...filteredData].sort((a, b) => {
        const aVal = a[sortConfig.key]?.toString().toLowerCase() || '';
        const bVal = b[sortConfig.key]?.toString().toLowerCase() || '';
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData;

  // Pagination
  const totalPages = pagination ? Math.ceil(sortedData.length / itemsPerPage) : 1;
  const startIndex = pagination ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = pagination ? startIndex + itemsPerPage : sortedData.length;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (columnIndex) => {
    if (!sortable) return;
    
    const direction = sortConfig.key === columnIndex && sortConfig.direction === 'asc' 
      ? 'desc' 
      : 'asc';
    setSortConfig({ key: columnIndex, direction });
  };

  const getSortIcon = (columnIndex) => {
    if (!sortable || sortConfig.key !== columnIndex) {
      return <Icons.Filter className="w-4 h-4 text-gray-300" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icons.ChevronUp className="w-4 h-4 text-indigo-600" />
      : <Icons.ChevronDown className="w-4 h-4 text-indigo-600" />;
  };

  const PaginationComponent = () => (
    <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        Showing {startIndex + 1} to {Math.min(endIndex, sortedData.length)} of {sortedData.length} results
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          const isActive = pageNum === currentPage;
          
          if (totalPages <= 7 || pageNum <= 3 || pageNum > totalPages - 3 || Math.abs(pageNum - currentPage) <= 1) {
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 text-sm rounded-md ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {pageNum}
              </button>
            );
          } else if (pageNum === 4 || pageNum === totalPages - 3) {
            return <span key={pageNum} className="px-2 text-gray-500">...</span>;
          }
          return null;
        })}
        
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                    sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 select-none' : ''
                  }`}
                  onClick={() => handleSort(index)}
                >
                  <div className="flex items-center space-x-2">
                    <span>{header}</span>
                    {sortable && getSortIcon(index)}
                  </div>
                </th>
              ))}
              {actions && (
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={headers.length + (actions ? 1 : 0)} 
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icons.Search className="w-8 h-8 text-gray-300" />
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {cell}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex items-center justify-end space-x-2">
                        {actions(row, rowIndex)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && <PaginationComponent />}
    </div>
  );
};

export default Table;