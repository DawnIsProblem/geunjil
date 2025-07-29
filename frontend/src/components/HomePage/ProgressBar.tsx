import React from 'react';
import styled from 'styled-components/native';

const ProgressBar = ({percent}: {percent: number}) => (
  <BarBackground>
    <BarFill style={{width: `${percent}%`}} />
  </BarBackground>
);

const BarBackground = styled.View`
  width: 100%;
  height: 24px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 20px;
  margin-top: 8px;
`;

const BarFill = styled.View`
  height: 24px;
  background: #000000;
  border-radius: 20px;
`;

export default ProgressBar;
