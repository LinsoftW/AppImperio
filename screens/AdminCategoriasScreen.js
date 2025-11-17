import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  SectionList,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  ScrollView
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import api from "../api/api";
import { MaterialIcons } from "@expo/vector-icons";

const AdminCategoriasScreen = ({ navigation }) => {
  const [categorias, setCategorias] = useState([]);
  const [descripcion, setDescripcion] = useState("");
  const [icon, setIcon] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [iconModalVisible, setIconModalVisible] = useState(false);

  // Íconos agrupados por categorías
  const groupedIcons = [
    {
      title: "General",
      data: ["home", "settings", "star", "category", "shopping-cart", "spa"]
    },
    {
      title: "Productos",
      data: ["watch", "laptop", "phone-android", "headset", "local-offer", "headphones", "computer"]
    },
    {
      title: "Servicios",
      data: ["restaurant", "local-taxi", "hotel", "school", "medical-services"]
    },
    {
      title: "Otros",
      data: ["bookmark", "favorite", "info", "help", "warning", "umbrella", "male", "female"]
    }
  ];

  // Obtener categorías al cargar la pantalla
  useEffect(() => {
    obtenerCategorias();
  }, []);

  const obtenerCategorias = async () => {
    setLoading(true);
    try {
      const response = await api.get("/categorias");
      setCategorias(response.data.datos);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      Alert.alert("Error", "No se pudieron cargar las categorías");
    } finally {
      setLoading(false);
    }
  };

  // Validar formulario
  const validarFormulario = () => {
    let valid = true;
    let newErrors = {};

    if (!descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Guardar categoría
  const guardarCategoria = async () => {
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/categorias/${editingId}`, { descripcion, icon });
        Alert.alert("Éxito", "Categoría actualizada correctamente");
      } else {
        await api.post("/categorias", { descripcion, icon });
        Alert.alert("Éxito", "Categoría creada correctamente");
      }

      setDescripcion("");
      setIcon("");
      setEditingId(null);
      setModalVisible(false);
      obtenerCategorias();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo guardar la categoría");
    } finally {
      setLoading(false);
    }
  };

  // Editar categoría
  const editarCategoria = (item) => {
    setDescripcion(item.attributes.descripcion);
    setIcon(item.attributes.icon || "");
    setEditingId(item.id);
    setModalVisible(true);
  };

  // Eliminar categoría
  const eliminarCategoria = (id) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro que deseas eliminar esta categoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await api.delete(`/categorias/${id}`);
              Alert.alert("Éxito", "Categoría eliminada correctamente");
              obtenerCategorias();
            } catch (error) {
              console.error("Error al eliminar:", error);
              Alert.alert("Error", "No se pudo eliminar la categoría");
            }
          },
        },
      ]
    );
  };

  // Renderizar item de categoría
  const renderItem = ({ item }) => (
    <View style={styles.categoriaItem}>
      <View style={styles.categoriaInfo}>
        <MaterialIcons
          name={item.attributes.icon || "category"}
          size={24}
          color="#4c669f"
        />
        <Text style={styles.categoriaNombre}>
          {item.attributes.descripcion}
        </Text>
      </View>
      <View style={styles.categoriaActions}>
        <TouchableOpacity onPress={() => editarCategoria(item)}>
          <Icon
            name="create"
            size={24}
            color="#4c669f"
            style={styles.actionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => eliminarCategoria(item.id)}>
          <Icon
            name="trash"
            size={24}
            color="#FF3B30"
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Renderizar modal de íconos
  // const renderIconModal = () => (
  //   <Modal
  //     animationType={Platform.OS === 'ios' ? 'slide' : 'fade'}
  //     transparent={true}
  //     visible={iconModalVisible}
  //     onRequestClose={() => setIconModalVisible(false)}
  //   >
  //     <TouchableWithoutFeedback onPress={() => setIconModalVisible(false)}>
  //       <View style={styles.iconModalBackdrop}>
  //         <TouchableWithoutFeedback>
  //           <View style={[
  //             styles.iconModalContainer,
  //             Platform.OS === 'ios' && styles.iosIconModalContainer
  //           ]}>
  //             <View style={styles.iconModalContent}>
  //               <View style={styles.iconModalHeader}>
  //                 <Text style={styles.iconModalTitle}>Seleccionar Ícono</Text>
  //                 <TouchableOpacity 
  //                   style={styles.closeIconModal}
  //                   onPress={() => setIconModalVisible(false)}
  //                 >
  //                   <Icon name="close" size={24} color="#4c669f" />
  //                 </TouchableOpacity>
  //               </View>
                
  //               <SectionList
  //                 sections={groupedIcons}
  //                 keyExtractor={(item) => item}
  //                 renderItem={({ item }) => (
  //                   <TouchableOpacity
  //                     style={[
  //                       styles.iconItem, 
  //                       icon === item && styles.selectedIconItem
  //                     ]}
  //                     onPress={() => {
  //                       setIcon(item);
  //                       setIconModalVisible(false);
  //                     }}
  //                   >
  //                     <MaterialIcons name={item} size={24} color="#4c669f" />
  //                     <Text style={styles.iconName}>{item}</Text>
  //                   </TouchableOpacity>
  //                 )}
  //                 renderSectionHeader={({ section: { title } }) => (
  //                   <Text style={styles.sectionHeader}>{title}</Text>
  //                 )}
  //                 contentContainerStyle={styles.iconList}
  //                 style={Platform.OS === 'ios' ? { maxHeight: Dimensions.get('window').height * 0.6 } : null}
  //               />
  //             </View>
  //           </View>
  //         </TouchableWithoutFeedback>
  //       </View>
  //     </TouchableWithoutFeedback>
  //   </Modal>
  // );
  const renderIconModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={iconModalVisible}
      onRequestClose={() => setIconModalVisible(false)}
    >
      <View style={styles.iconModalBackdrop}>
        {/* Para iOS: diseño de bottom sheet */}
        {Platform.OS === 'ios' ? (
          <View style={styles.iosIconModalContainer}>
            <View style={styles.iconModalHandle} />
            <Text style={styles.iconModalTitle}>Seleccionar Ícono</Text>
            <ScrollView 
              style={styles.iosIconScrollView}
              contentContainerStyle={styles.iosIconScrollContent}
            >
              {groupedIcons.map((section) => (
                <View key={section.title} style={styles.sectionContainer}>
                  <Text style={styles.sectionHeader}>{section.title}</Text>
                  <View style={styles.iconsContainer}>
                    {section.data.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[
                          styles.iconItem,
                          icon === item && styles.selectedIconItem
                        ]}
                        onPress={() => {
                          setIcon(item);
                          setIconModalVisible(false);
                        }}
                      >
                        <MaterialIcons name={item} size={28} color="#4c669f" />
                        <Text style={styles.iconName}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeIconButton}
              onPress={() => setIconModalVisible(false)}
            >
              <Text style={styles.closeIconText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Para Android: diseño más simple
          <View style={styles.androidIconModalContainer}>
            <View style={styles.androidModalContent}>
              <Text style={styles.iconModalTitle}>Seleccionar Ícono</Text>
              <ScrollView style={styles.androidIconScrollView}>
                {groupedIcons.map((section) => (
                  <View key={section.title} style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                    <View style={styles.iconsContainer}>
                      {section.data.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={[
                            styles.iconItem,
                            icon === item && styles.selectedIconItem
                          ]}
                          onPress={() => {
                            setIcon(item);
                            setIconModalVisible(false);
                          }}
                        >
                          <MaterialIcons name={item} size={24} color="#4c669f" />
                          <Text style={styles.iconName}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.closeIconButton}
                onPress={() => setIconModalVisible(false)}
              >
                <Text style={styles.closeIconText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1a3a8f", "#2a4a9f", "#3b5998"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Administrar Categorías</Text>
      </LinearGradient>

      <View style={styles.content}>
        <FlatList
          data={categorias}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay categorías registradas</Text>
          }
          refreshing={loading}
          onRefresh={obtenerCategorias}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setDescripcion("");
            setIcon("");
            setEditingId(null);
            setModalVisible(true);
          }}
        >
          <Icon name="add" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Agregar Categoría</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para agregar/editar categoría */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingId ? "Editar Categoría" : "Agregar Categoría"}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre de la Categoría</Text>
              <TextInput
                style={[styles.input, errors.descripcion && styles.inputError]}
                placeholder="Ej. Perfumes"
                value={descripcion}
                onChangeText={setDescripcion}
              />
              {errors.descripcion && (
                <Text style={styles.errorText}>{errors.descripcion}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ícono</Text>
              <TouchableOpacity 
                style={styles.iconSelector}
                onPress={() => setIconModalVisible(true)}
              >
                {icon ? (
                  <View style={styles.selectedIconContainer}>
                    <MaterialIcons name={icon} size={24} color="#4c669f" />
                    <Text style={styles.selectedIconText}>{icon}</Text>
                  </View>
                ) : (
                  <Text style={styles.selectIconText}>Seleccionar ícono</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={guardarCategoria}
                disabled={loading}
              >
                <Text style={styles.modalButtonText}>
                  {loading
                    ? editingId
                      ? "Actualizando..."
                      : "Guardando..."
                    : editingId
                    ? "Actualizar"
                    : "Guardar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para selección de íconos */}
      {renderIconModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#F5F5F5",
  // },
  // header: {
  //   padding: 20,
  //   paddingTop: 40,
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  // backButton: {
  //   marginRight: 15,
  // },
  // headerText: {
  //   color: "#FFF",
  //   fontSize: 20,
  //   fontWeight: "bold",
  // },
  // content: {
  //   flex: 1,
  //   padding: 15,
  // },
  // categoriaItem: {
  //   backgroundColor: "#FFF",
  //   borderRadius: 8,
  //   padding: 15,
  //   marginBottom: 10,
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   elevation: 2,
  // },
  // categoriaInfo: {
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  // categoriaNombre: {
  //   marginLeft: 10,
  //   fontSize: 16,
  //   color: "#333",
  // },
  // categoriaActions: {
  //   flexDirection: "row",
  // },
  // actionIcon: {
  //   marginLeft: 15,
  // },
  // emptyText: {
  //   textAlign: "center",
  //   marginTop: 20,
  //   color: "#666",
  //   fontSize: 16,
  // },
  // addButton: {
  //   backgroundColor: "#FF6B00",
  //   borderRadius: 8,
  //   padding: 15,
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: 10,
  // },
  // addButtonText: {
  //   color: "#FFF",
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   marginLeft: 10,
  // },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: "center",
  //   backgroundColor: "rgba(0,0,0,0.5)",
  // },
  // modalContent: {
  //   backgroundColor: "#FFF",
  //   margin: 20,
  //   borderRadius: 10,
  //   padding: 20,
  // },
  // modalTitle: {
  //   fontSize: 20,
  //   fontWeight: "bold",
  //   color: "#333",
  //   marginBottom: 20,
  //   textAlign: "center",
  // },
  // inputGroup: {
  //   marginBottom: 15,
  // },
  // label: {
  //   fontSize: 16,
  //   color: "#333",
  //   marginBottom: 8,
  //   fontWeight: "500",
  // },
  // input: {
  //   backgroundColor: "#FFF",
  //   borderRadius: 8,
  //   padding: 15,
  //   fontSize: 16,
  //   borderWidth: 1,
  //   borderColor: "#DDD",
  // },
  // inputError: {
  //   borderColor: "#FF3B30",
  // },
  // errorText: {
  //   color: "#FF3B30",
  //   marginTop: 5,
  //   fontSize: 14,
  // },
  // helpText: {
  //   color: "#666",
  //   fontSize: 12,
  //   marginTop: 5,
  // },
  // modalButtons: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   marginTop: 20,
  // },
  // modalButton: {
  //   borderRadius: 8,
  //   padding: 15,
  //   flex: 1,
  //   alignItems: "center",
  // },
  // cancelButton: {
  //   backgroundColor: "#DDD",
  //   marginRight: 10,
  // },
  // saveButton: {
  //   backgroundColor: "#FF6B00",
  // },
  // modalButtonText: {
  //   color: "#FFF",
  //   fontSize: 16,
  //   fontWeight: "bold",
  // },
  // iconSelector: {
  //   backgroundColor: "#FFF",
  //   borderRadius: 8,
  //   padding: 15,
  //   fontSize: 16,
  //   borderWidth: 1,
  //   borderColor: "#DDD",
  // },
  // selectedIconContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  // selectedIconText: {
  //   marginLeft: 10,
  //   color: "#333",
  // },
  // selectIconText: {
  //   color: "#666",
  // },
  // iconModalBackdrop: {
  //   flex: 1,
  //   justifyContent: 'flex-end',
  //   backgroundColor: 'rgba(0,0,0,0.5)',
  // },
  // iconModalContainer: {
  //   backgroundColor: '#FFF',
  //   maxHeight: Dimensions.get('window').height * 0.7,
  // },
  // iosIconModalContainer: {
  //   borderTopLeftRadius: 20,
  //   borderTopRightRadius: 20,
  //   overflow: 'hidden',
  // },
  // iconModalContent: {
  //   padding: 20,
  // },
  // iconModalHeader: {
  //   flexDirection: "row",
  //   justifyContent: "space-between",
  //   alignItems: "center",
  //   marginBottom: 15,
  // },
  // iconModalTitle: {
  //   fontSize: 18,
  //   fontWeight: "bold",
  //   color: "#333",
  // },
  // closeIconModal: {
  //   padding: 5,
  // },
  // iconList: {
  //   paddingBottom: 20,
  // },
  // iconItem: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   padding: 10,
  //   borderRadius: 5,
  //   marginVertical: 2,
  // },
  // selectedIconItem: {
  //   backgroundColor: "#E3F2FD",
  // },
  // iconName: {
  //   marginLeft: 15,
  //   color: "#333",
  //   fontSize: 14,
  // },
  // sectionHeader: {
  //   backgroundColor: "#FFF",
  //   paddingVertical: 8,
  //   fontWeight: "bold",
  //   color: "#4c669f",
  //   marginTop: 15,
  // },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 15,
  },
  categoriaItem: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  categoriaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoriaNombre: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  categoriaActions: {
    flexDirection: "row",
  },
  actionIcon: {
    marginLeft: 15,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#FF6B00",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    marginTop: 5,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    borderRadius: 8,
    padding: 15,
    flex: 1,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#DDD",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#FF6B00",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconSelector: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  selectedIconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedIconText: {
    marginLeft: 10,
    color: "#333",
  },
  selectIconText: {
    color: "#666",
  },

  // ESTILOS DEL MODAL DE ÍCONOS (NUEVOS Y LIMPIOS)
  iconModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
  },
  
  // iOS
  iosIconModalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  iconModalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#CCC',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  iosIconScrollView: {
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  iosIconScrollContent: {
    paddingBottom: 20,
  },
  
  // Android
  androidIconModalContainer: {
    width: '90%',
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  androidModalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  androidIconScrollView: {
    maxHeight: Dimensions.get('window').height * 0.5,
  },
  
  // Comunes
  iconModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: 'center',
    marginBottom: 15,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4c669f",
    marginBottom: 10,
    marginTop: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconItem: {
    width: '48%',
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8F9FA',
  },
  selectedIconItem: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: '#4c669f',
  },
  iconName: {
    marginLeft: 10,
    color: "#333",
    fontSize: 12,
    flex: 1,
  },
  closeIconButton: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeIconText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AdminCategoriasScreen;
