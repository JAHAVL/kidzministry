import React, { useState, useEffect } from 'react';
import './Checklist.css';

interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

interface ChecklistProps {
  items: string[];
  storageKey: string;
  color?: string;
}

const Checklist: React.FC<ChecklistProps> = ({ items, storageKey, color = '#4169e1' }) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);

  // Initialize checklist from localStorage or props
  useEffect(() => {
    const storedItems = localStorage.getItem(storageKey);
    
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        setChecklistItems(parsedItems);
      } catch (error) {
        console.error('Error parsing stored checklist items:', error);
        initializeChecklist();
      }
    } else {
      initializeChecklist();
    }
  }, [items, storageKey]);

  // Initialize checklist from the provided items
  const initializeChecklist = () => {
    const newItems = items.map((text, index) => ({
      id: `${storageKey}-item-${index}`,
      text,
      checked: false
    }));
    setChecklistItems(newItems);
  };

  // Update localStorage when checklist changes
  useEffect(() => {
    if (checklistItems.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(checklistItems));
    }
  }, [checklistItems, storageKey]);

  // Toggle checked state of an item
  const toggleChecked = (id: string) => {
    const updatedItems = checklistItems.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklistItems(updatedItems);
  };

  // Reset all checklist items
  const resetChecklist = () => {
    const resetItems = checklistItems.map(item => ({ ...item, checked: false }));
    setChecklistItems(resetItems);
  };

  return (
    <div className="checklist-container">
      <div className="checklist-header">
        <h3>Track Your Progress</h3>
        <button 
          className="reset-button" 
          onClick={resetChecklist}
          aria-label="Reset checklist"
        >
          Reset All
        </button>
      </div>
      <ul className="checklist">
        {checklistItems.map(item => (
          <li key={item.id} className={item.checked ? 'checked' : ''}>
            <label className="checklist-label">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleChecked(item.id)}
              />
              <span className="checkbox-custom" style={{ borderColor: color }}>
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="4">
                  <path d="M5 13l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="item-text">{item.text}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checklist;
