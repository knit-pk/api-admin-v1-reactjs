import React from 'react';

const containerStyle = {
  display: 'flex',
  'background-color': '#2196f3',
  'justify-content': 'center',
  'align-content': 'center',
  'flex-wrap': 'wrap',
  'align-items': 'center',
  height: '100vh',
};

const loaderStyle = {
  display: 'flex',
  width: '100vw',
  'justify-content': 'center',
  margin: '20px',
};

const textStyle = {
  color: '#ffffff',
  'font-variant': 'small-caps',
  'font-weight': '600',
  'font-size': '1.1rem',
};

const LoaderPacman = props => (
  <div style={containerStyle}>
    <div className="loader" style={loaderStyle} {...props}>
      <div className="pacman">
        <div /><div /><div /><div /><div />
      </div>
    </div>
    <div style={textStyle}>Loading..</div>
  </div>
);

export default LoaderPacman;
