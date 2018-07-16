import React from 'react';

const containerStyle = {
  display: 'flex',
  backgroundColor: '#2196f3',
  justifyContent: 'center',
  alignContent: 'center',
  flexWrap: 'wrap',
  alignItems: 'center',
  height: '100vh',
};

const loaderStyle = {
  display: 'flex',
  width: '100vw',
  justifyContent: 'center',
  margin: '20px',
};

const textStyle = {
  color: '#ffffff',
  fontVariant: 'small-caps',
  fontWeight: '600',
  fontSize: '1.1rem',
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
