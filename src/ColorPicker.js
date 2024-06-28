// src/ColorPicker.js

import React, { useState } from 'react';
import './ColorPicker.css';

const ColorPicker = ({ colors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectColor = (color) => {
    setSelectedColor(color);
    setIsOpen(false);
  };

  return (
    <div className='color-picker'>
      <div
        className='selected-color'
        style={{ background: selectedColor }}
        onClick={toggleDropdown}
      ></div>
      {isOpen && (
        <div className='color-dropdown'>
          {colors.map((color, index) => (
            <div
              key={index}
              className='color-option'
              style={{ background: color }}
              onClick={() => selectColor(color)}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
