import React from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';

const LocationInput = () => {
  return (
    <MapBox>
      <Icon name="location-outline" size={28} color="#999" />
      <Text>지도에 위치 표시</Text>
    </MapBox>
  );
};

const MapBox = styled.View`
  height: 150px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
`;

const Text = styled.Text`
  color: #999;
  margin-top: 8px;
`;

export default LocationInput;
