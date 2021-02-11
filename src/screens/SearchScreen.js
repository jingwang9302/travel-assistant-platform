import React, { useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import SearchBar from "../components/SearchBar";

const SearchScreen = () => {
  return (
    <View>
      <Text>search screen</Text>
      <SearchBar />
    </View>
  );
};

const styles = StyleSheet.create({});

export default SearchScreen;
