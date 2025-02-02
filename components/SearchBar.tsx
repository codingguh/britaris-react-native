import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type Props = {
  onSearch: (query: string) => void;  // Tambahkan prop untuk meng-handle pencarian
};

const SearchBar = ({ onSearch }: Props) => {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          placeholder='Search example macbook'
          placeholderTextColor={Colors.lightGrey}
          style={styles.searchText}
          autoCapitalize='none'
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => onSearch(query)}  // Cari saat menekan Enter
        />
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => onSearch(query)}  // Cari saat tombol ditekan
        >
          <Ionicons name='search-outline' size={25} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    gap: 10,
  },
  searchText: {
    fontSize: 14,
    backgroundColor: "#E4E4E4",
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    color: Colors.darkGrey,
  },
  searchButton: {
    width: 60,
    height: 60,
    backgroundColor: Colors.tint,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
