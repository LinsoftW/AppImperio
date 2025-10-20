import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";

const QuantitySelector = ({
  initialQuantity = 1,
  handleQuantityChange,
  maxQuantity,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    const newValue = Math.max(1, quantity - 1);
    setQuantity(newValue);
    handleQuantityChange(newValue);
  };

  const handleIncrease = () => {
    const newValue = Math.min(maxQuantity, quantity + 1);
    setQuantity(newValue);
    handleQuantityChange(newValue);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleDecrease} style={styles.button}>
        <Ionicons name="remove" size={20} color="#333" />
      </TouchableOpacity>

      <Text style={styles.quantity}>{quantity}</Text>

      <TouchableOpacity onPress={handleIncrease} style={styles.button}>
        <Ionicons name="add" size={20} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   width: 120,
  //   borderWidth: 1,
  //   borderColor: '#ddd',
  //   borderRadius: 8,
  //   padding: 5,
  //   marginVertical: 5,
  // },
  // button: {
  //   padding: 5,
  // },
  // quantity: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   minWidth: 30,
  //   textAlign: 'center',
  // },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    padding: 3,
    // marginVertical: 16,
    width: "100%",
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "600",
    marginHorizontal: 16,
  },
});

export default QuantitySelector;
