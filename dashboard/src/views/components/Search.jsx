import React from 'react';

const Search = ({ setParPage, searchValue, setSearchValue }) => {
  return (
    <div className='flex justify-between items-center'>
      {/* Pagination Dropdown */}
      <select
        onChange={(e) => setParPage(parseInt(e.target.value))}
        className='px-4 py-2 focus:border-[#0077cc] outline-none bg-[#ffffff] border border-[#0077cc] rounded-md text-[#000000]'
      >
        <option value='5'>5</option>
        <option value='10'>10</option>
        <option value='20'>20</option>
      </select>

      {/* Search Input */}
      <input
        className='px-4 py-2 focus:border-[#0077cc] outline-none bg-[#ffffff] border border-[#0077cc] rounded-md text-[#000000]'
        type='text'
        placeholder='Search'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};

export default Search;