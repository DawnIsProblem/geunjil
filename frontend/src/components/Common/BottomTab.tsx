import React from 'react';
import styled from 'styled-components/native';

const BottomTab = () => {
  return (
    <TabBar>
      <TabItem>🏠 Home</TabItem>
      <TabItem>📅 Challenge</TabItem>
      <TabItem>😊 MyPage</TabItem>
    </TabBar>
  );
};

const TabBar = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 12px;
  background-color: #fff;
  border-top-width: 1px;
  border-color: #ddd;
`;

const TabItem = styled.Text`
  font-size: 16px;
`;

export default BottomTab;
