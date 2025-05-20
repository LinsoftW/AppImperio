import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const QuantitySelector = ({ initialQuantity = 1, onQuantityChange, maxQuantity }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    const newValue = Math.max(1, quantity - 1);
    setQuantity(newValue);
    onQuantityChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(maxQuantity, quantity + 1);
    setQuantity(newValue);
    onQuantityChange(newValue);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleDecrease} style={styles.button}>
        <Icon name="remove" size={20} color="#333" />
      </TouchableOpacity>

      <Text style={styles.quantity}>{quantity}</Text>

      <TouchableOpacity onPress={handleIncrease} style={styles.button}>
        <Icon name="add" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 5,
    marginVertical: 5,
  },
  button: {
    padding: 5,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
});

export default QuantitySelector;