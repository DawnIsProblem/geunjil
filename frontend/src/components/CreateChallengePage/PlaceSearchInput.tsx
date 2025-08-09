import React, {useState} from 'react';
import {View, TextInput, FlatList, TouchableOpacity, Text} from 'react-native';
import {searchPlaces} from '../../api/google.Api';

interface PlaceSearchInputProps {
  onPlaceSelected: (place: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => void;
}

const PlaceSearchInput = ({onPlaceSelected}: PlaceSearchInputProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 2) return setResults([]);
    try {
      const places = await searchPlaces(text);
      setResults(places);
    } catch {
      setResults([]);
    }
  };

  const handleSelect = (item: any) => {
    onPlaceSelected({
      name: item.name,
      address: item.formatted_address,
      lat: item.geometry.location.lat,
      lng: item.geometry.location.lng,
    });
    setResults([]);
    setQuery(item.formatted_address);
  };

  return (
    <View style={{zIndex: 10}}>
      <TextInput
        placeholder="장소명 또는 주소 입력"
        value={query}
        onChangeText={handleSearch}
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
          backgroundColor: '#fff',
        }}
      />
      <FlatList
        data={results}
        keyExtractor={item => item.place_id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{padding: 12, borderBottomWidth: 1, borderColor: '#eee'}}
            onPress={() => handleSelect(item)}>
            <Text>{item.name}</Text>
            <Text style={{color: '#666', fontSize: 12}}>
              {item.formatted_address}
            </Text>
          </TouchableOpacity>
        )}
        style={{
          maxHeight: 200,
          backgroundColor: '#fff',
          borderRadius: 8,
        }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default PlaceSearchInput;
