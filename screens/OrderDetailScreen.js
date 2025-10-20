import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import api from '../api/api';
import Constants from 'expo-constants';

const { dirImg } = Constants.expoConfig.extra;

const OrderDetailScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  // const orderId = 1;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // console.log(orderId)
        setLoading(true);
        const response = await api.get(`/pedidos/${orderId}`);
        setOrder(response.data.data);
        // console.log(response.data.data)
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading || !order) {
    return (
      <LinearGradient colors={["#1a3a8f", "#2a4a9f", "#3b5998"]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={["#1a3a8f", "#2a4a9f", "#3b5998"]} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Pedido</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.orderInfoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Número de pedido:</Text>
            <Text style={styles.infoValue}>#{order.id}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>
              {new Date(order.attributes.fecha_pedido).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado:</Text>
            <View style={[
              styles.statusBadge,
              order.attributes.estado === 'completado' && styles.statusCompleted,
              order.attributes.estado === 'pendiente' && styles.statusPending,
              order.attributes.estado === 'cancelado' && styles.statusCancelled
            ]}>
              <Text style={styles.statusText}>
                {order.attributes.estado.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Método de pago:</Text>
            <Text style={styles.infoValue}>{order.attributes.transaccion}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total:</Text>
            <Text style={styles.totalPrice}>
              ${parseFloat(order.attributes.total).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Productos</Text>
          
          {order.attributes.productos.map((producto, index) => (
            <View key={index} style={styles.productItem}>
              <Image
                source={{ uri: `http://${dirImg}${producto.imagen.split("/").pop()}` }}
                style={styles.productImage}
                resizeMode="contain"
              />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{producto.nombre}</Text>
                <Text style={styles.productDetails}>
                  {producto.cantidad} x ${parseFloat(producto.precio_unitario).toFixed(2)}
                </Text>
                <Text style={styles.productSubtotal}>
                  Subtotal: ${(producto.cantidad * producto.precio_unitario).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.sectionTitle}>Dirección de envío</Text>
          <Text style={styles.addressText}>{order.attributes.usuario.direccion}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 35,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#FFFFFF80',
    fontSize: 14,
  },
  infoValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  totalPrice: {
    color: '#f5e1a4ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#3b5998',
  },
  statusCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusPending: {
    backgroundColor: '#FFC107',
  },
  statusCancelled: {
    backgroundColor: '#F44336',
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#f5e1a4ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  productsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  productDetails: {
    color: '#FFFFFF80',
    fontSize: 13,
    marginBottom: 5,
  },
  productSubtotal: {
    color: '#FFFFFFCC',
    fontSize: 13,
    fontWeight: '500',
  },
  addressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
  },
  addressText: {
    color: '#FFF',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default OrderDetailScreen;