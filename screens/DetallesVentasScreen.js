// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   StyleSheet, 
//   ScrollView, 
//   ActivityIndicator, 
//   Alert,
//   TouchableOpacity,
//   Linking 
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import Icon from 'react-native-vector-icons/Ionicons';
// import api from '../api/api';

// const DetalleVentaScreen = ({ route, navigation }) => {
//   const { ventaId } = route.params;
//   const [venta, setVenta] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [repartidor, setRepartidor] = useState(null);

//   // Cargar los detalles de la venta
//   useEffect(() => {
//     const cargarDetalleVenta = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get(`/ventas/${ventaId}`);
        
//         if (response.data.success) {
//           setVenta(response.data.data);
          
//           // Si hay datos de repartidor
//           if (response.data.data.attributes.repartidor) {
//             setRepartidor(response.data.data.attributes.repartidor);
//           }
//         }
//       } catch (error) {
//         console.error('Error al cargar venta:', error);
//         Alert.alert('Error', 'No se pudo cargar el detalle de la venta');
//       } finally {
//         setLoading(false);
//       }
//     };

//     cargarDetalleVenta();
//   }, [ventaId]);

//   // Formatear fecha
//   const formatFecha = (fechaString) => {
//     const fecha = new Date(fechaString);
//     return fecha.toLocaleDateString('es-ES', {
//       day: '2-digit',
//       month: 'long',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Llamar al repartidor
//   const llamarRepartidor = () => {
//     if (repartidor?.telefono) {
//       Linking.openURL(`tel:${repartidor.telefono}`);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#4c669f" />
//       </View>
//     );
//   }

//   if (!venta) {
//     return (
//       <View style={styles.emptyContainer}>
//         <Text style={styles.emptyText}>No se encontró la venta solicitada</Text>
//       </View>
//     );
//   }

//   const datosVenta = venta.attributes;

//   return (
//     <ScrollView style={styles.container}>
//       <LinearGradient colors={['#4c669f', '#3b5998']} style={styles.header}>
//         <Text style={styles.headerTitle}>Detalle de Venta</Text>
//         <Text style={styles.headerId}>ID: #{venta.id}</Text>
//       </LinearGradient>

//       <View style={styles.card}>
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Información de la Venta</Text>
//           <View style={styles.infoRow}>
//             <Icon name="calendar" size={20} color="#666" />
//             <Text style={styles.infoText}>{formatFecha(datosVenta.fecha_venta)}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Icon name="pricetag" size={20} color="#666" />
//             <Text style={styles.infoText}>Total: ${parseFloat(datosVenta.total).toFixed(2)}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Icon name="card" size={20} color="#666" />
//             <Text style={styles.infoText}>Estado: {datosVenta.estado || 'Completado'}</Text>
//           </View>
//         </View>

//         <View style={styles.divider} />

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Datos del Cliente</Text>
//           <View style={styles.infoRow}>
//             <Icon name="person" size={20} color="#666" />
//             <Text style={styles.infoText}>{datosVenta.cliente_nombre}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Icon name="call" size={20} color="#666" />
//             <Text style={styles.infoText}>{datosVenta.cliente_telefono}</Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Icon name="location" size={20} color="#666" />
//             <Text style={styles.infoText}>{datosVenta.cliente_direccion}</Text>
//           </View>
//         </View>

//         {repartidor && (
//           <>
//             <View style={styles.divider} />
            
//             <View style={styles.section}>
//               <Text style={styles.sectionTitle}>Repartidor Asignado</Text>
//               <View style={styles.infoRow}>
//                 <Icon name="bicycle" size={20} color="#666" />
//                 <Text style={styles.infoText}>{repartidor.nombre}</Text>
//               </View>
//               <View style={styles.infoRow}>
//                 <Icon name="car" size={20} color="#666" />
//                 <Text style={styles.infoText}>{repartidor.vehiculo}</Text>
//               </View>
//               <TouchableOpacity 
//                 style={styles.contactButton}
//                 onPress={llamarRepartidor}
//               >
//                 <Icon name="call" size={20} color="#FFF" />
//                 <Text style={styles.contactButtonText}>Llamar: {repartidor.telefono}</Text>
//               </TouchableOpacity>
//               <View style={styles.infoRow}>
//                 <Icon name="time" size={20} color="#666" />
//                 <Text style={styles.infoText}>Tiempo estimado: {repartidor.tiempoEstimado}</Text>
//               </View>
//             </View>
//           </>
//         )}

//         <View style={styles.divider} />

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Productos</Text>
//           {datosVenta.productos?.map((producto, index) => (
//             <View key={index} style={styles.productoContainer}>
//               <View style={styles.productoHeader}>
//                 <Text style={styles.productoNombre}>{producto.nombre}</Text>
//                 <Text style={styles.productoPrecio}>${parseFloat(producto.precio_unitario).toFixed(2)}</Text>
//               </View>
//               <View style={styles.productoDetails}>
//                 <Text style={styles.productoCantidad}>Cantidad: {producto.cantidad}</Text>
//                 <Text style={styles.productoSubtotal}>Subtotal: ${parseFloat(producto.total).toFixed(2)}</Text>
//               </View>
//             </View>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   header: {
//     padding: 20,
//     paddingBottom: 25,
//   },
//   headerTitle: {
//     color: '#FFF',
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   headerId: {
//     color: 'rgba(255,255,255,0.8)',
//     fontSize: 14,
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   card: {
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     margin: 15,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   section: {
//     marginBottom: 15,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#EEE',
//     paddingBottom: 8,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   infoText: {
//     marginLeft: 10,
//     fontSize: 16,
//     color: '#444',
//     flex: 1,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#EEE',
//     marginVertical: 20,
//   },
//   productoContainer: {
//     backgroundColor: '#F9F9F9',
//     borderRadius: 8,
//     padding: 15,
//     marginBottom: 10,
//   },
//   productoHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   productoNombre: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     flex: 1,
//   },
//   productoPrecio: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#2ecc71',
//   },
//   productoDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   productoCantidad: {
//     fontSize: 14,
//     color: '#666',
//   },
//   productoSubtotal: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   contactButton: {
//     flexDirection: 'row',
//     backgroundColor: '#4CAF50',
//     borderRadius: 6,
//     padding: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//     marginBottom: 15,
//   },
//   contactButtonText: {
//     color: '#FFF',
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
// });

// export default DetalleVentaScreen;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../api/api';

const DetalleVentaScreen = ({ route, navigation }) => {
  const { ventaId } = route.params;
  const [venta, setVenta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [repartidor, setRepartidor] = useState(null);

  // Cargar los detalles de la venta
  useEffect(() => {
    const cargarDetalleVenta = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/ventas/${ventaId}`);
        
        if (response.data.success) {
          setVenta(response.data.data);
          
          if (response.data.data.attributes.repartidor) {
            setRepartidor(response.data.data.attributes.repartidor);
          }
        }
      } catch (error) {
        console.error('Error al cargar venta:', error);
        Alert.alert('Error', 'No se pudo cargar el detalle de la venta');
      } finally {
        setLoading(false);
      }
    };

    cargarDetalleVenta();
  }, [ventaId]);

  // Formatear fecha compatible con Android
  const formatFecha = (fechaString) => {
    try {
      const fecha = new Date(fechaString);
      if (isNaN(fecha.getTime())) {
        return 'Fecha no disponible';
      }
      
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Fecha no disponible';
    }
  };

  // Llamar al repartidor con verificación
  const llamarRepartidor = () => {
    if (repartidor?.telefono) {
      const phoneNumber = repartidor.telefono.startsWith('+') ? 
        repartidor.telefono : `+${repartidor.telefono}`;
      
      Linking.canOpenURL(`tel:${phoneNumber}`)
        .then(supported => {
          if (supported) {
            Linking.openURL(`tel:${phoneNumber}`);
          } else {
            Alert.alert('Error', 'No se puede realizar la llamada desde este dispositivo');
          }
        })
        .catch(err => console.error('Error al abrir teléfono:', err));
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4c669f" />
      </View>
    );
  }

  if (!venta) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No se encontró la venta solicitada</Text>
      </View>
    );
  }

  const datosVenta = venta.attributes;

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <LinearGradient 
        colors={['#4c669f', '#3b5998']} 
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Detalle de Venta</Text>
        <Text style={styles.headerId}>ID: #{venta.id}</Text>
      </LinearGradient>

      <View style={styles.card}>
        {/* Sección Información de la Venta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Venta</Text>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={20} color="#666" />
            <Text style={styles.infoText}>
              {formatFecha(datosVenta.fecha_venta)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Icon name="pricetag" size={20} color="#666" />
            <Text style={styles.infoText}>
              Total: ${parseFloat(datosVenta.total || 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Sección Datos del Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Cliente</Text>
          <View style={styles.infoRow}>
            <Icon name="person" size={20} color="#666" />
            <Text style={styles.infoText}>
              {datosVenta.cliente_nombre || 'No especificado'}
            </Text>
          </View>
          {datosVenta.cliente_telefono && (
            <View style={styles.infoRow}>
              <Icon name="call" size={20} color="#666" />
              <Text style={styles.infoText}>{datosVenta.cliente_telefono}</Text>
            </View>
          )}
          {datosVenta.cliente_direccion && (
            <View style={styles.infoRow}>
              <Icon name="location" size={20} color="#666" />
              <Text style={styles.infoText}>{datosVenta.cliente_direccion}</Text>
            </View>
          )}
        </View>

        {/* Sección Repartidor (si existe) */}
        {repartidor && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Repartidor Asignado</Text>
              <View style={styles.infoRow}>
                <Icon name="bicycle" size={20} color="#666" />
                <Text style={styles.infoText}>{repartidor.nombre}</Text>
              </View>
              {repartidor.vehiculo && (
                <View style={styles.infoRow}>
                  <Icon name="car" size={20} color="#666" />
                  <Text style={styles.infoText}>{repartidor.vehiculo}</Text>
                </View>
              )}
              {repartidor.telefono && (
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={llamarRepartidor}
                >
                  <Icon name="call" size={20} color="#FFF" />
                  <Text style={styles.contactButtonText}>
                    Llamar: {repartidor.telefono}
                  </Text>
                </TouchableOpacity>
              )}
              {repartidor.tiempoEstimado && (
                <View style={styles.infoRow}>
                  <Icon name="time" size={20} color="#666" />
                  <Text style={styles.infoText}>
                    Tiempo estimado: {repartidor.tiempoEstimado}
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        <View style={styles.divider} />

        {/* Sección Productos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos</Text>
          {datosVenta.productos?.map((producto, index) => (
            <View key={index} style={styles.productoContainer}>
              <View style={styles.productoHeader}>
                <Text style={styles.productoNombre}>
                  {producto.nombre || 'Producto no especificado'}
                </Text>
                <Text style={styles.productoPrecio}>
                  ${parseFloat(producto.precio_unitario || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.productoDetails}>
                <Text style={styles.productoCantidad}>
                  Cantidad: {producto.cantidad || 0}
                </Text>
                <Text style={styles.productoSubtotal}>
                  Subtotal: ${parseFloat(producto.total || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// Estilos optimizados para Android e iOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    paddingBottom: 25,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  headerId: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 15,
    padding: 20,
    ...Platform.select({
      android: {
        elevation: 2,
        marginHorizontal: 10,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 8,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#444',
    flex: 1,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#EEE',
    marginVertical: 20,
  },
  productoContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  productoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productoNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  productoPrecio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  productoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productoCantidad: {
    fontSize: 14,
    color: '#666',
  },
  productoSubtotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  contactButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default DetalleVentaScreen;