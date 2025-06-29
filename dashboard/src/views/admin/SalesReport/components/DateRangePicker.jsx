import React from 'react';
import { format } from 'date-fns';

const DateRangePicker = ({ initialRange, onChange }) => {
  const [startDate, setStartDate] = React.useState(
    format(initialRange.startDate, 'yyyy-MM-dd')
  );
  const [endDate, setEndDate] = React.useState(
    format(initialRange.endDate, 'yyyy-MM-dd')
  );

  const handleChange = () => {
    onChange({
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });
  };

  return (
    <div className="mb-6">
      <div className="flex gap-4 mb-2">
        <div>
          <label className="block font-medium mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input input-bordered"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input input-bordered"
          />
        </div>
      </div>
      <button 
        onClick={handleChange}
        className="btn btn-primary"
      >
        Apply Date Range
      </button>
    </div>
  );
};

export default DateRangePicker;