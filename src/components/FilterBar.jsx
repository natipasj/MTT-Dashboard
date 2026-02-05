import React from 'react';
import clsx from 'clsx';
import { Filter } from 'lucide-react';

const CheckboxGroup = ({ title, options, selected, onChange, colorKey }) => {
    // Helper to toggle selection
    const handleToggle = (opt) => {
        if (selected.includes(opt)) {
            onChange(selected.filter(s => s !== opt));
        } else {
            onChange([...selected, opt]);
        }
    };

    return (
        <div className="filter-box">
            <div className="filter-title"><Filter size={12} /> Filter {title}</div>
            <div className="filter-list">
                {options.map(opt => (
                    <div key={opt} className="filter-item">
                        <label>
                            <input
                                type="checkbox"
                                checked={selected.includes(opt)}
                                onChange={() => handleToggle(opt)}
                            />
                            <span title={opt}>{opt}</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const FilterBar = ({
    years, selectedYear, onYearChange,
    months, selectedMonths, onMonthsChange,
    branches, selectedBranches, onBranchesChange,
    channels, selectedChannels, onChannelsChange
}) => {
    return (
        <div className="filter-section">
            <div className="year-selector">
                {years.map(year => (
                    <button
                        key={year}
                        className={clsx('year-btn', selectedYear === year && 'active')}
                        onClick={() => onYearChange(year)}
                    >
                        {year}
                    </button>
                ))}
            </div>

            <CheckboxGroup
                title="Month"
                options={months}
                selected={selectedMonths}
                onChange={onMonthsChange}
            />

            <CheckboxGroup
                title="Branch"
                options={branches}
                selected={selectedBranches}
                onChange={onBranchesChange}
            />

            <CheckboxGroup
                title="Channel"
                options={channels}
                selected={selectedChannels}
                onChange={onChannelsChange}
            />
        </div>
    );
};
