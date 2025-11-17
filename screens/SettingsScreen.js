// FUNCIONANDO A FULL
import { 
  Alert, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ScrollView, 
  Modal, 
  TextInput,
  KeyboardAvoidingView,
  Platform 
} from "react-native";
import { useUser } from "./UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import Constants from "expo-constants";

const SettingsScreen = ({ navigation }) => {
  const { user, logout, changePassword } = useUser(); // Asegúrate de tener changePassword en tu UserContext
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleChangePassword = async () => {
    setError('');
    
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Las nuevas contraseñas no coinciden');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      Alert.alert('Éxito', 'Contraseña cambiada correctamente');
      setShowPasswordModal(false);
      // Limpiar campos
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message || 'Error al cambiar la contraseña');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión", 
      "¿Estás seguro que deseas salir de la aplicación?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, salir", onPress: () => logout() }
      ]
    );
  };

  // const MenuItem = ({ icon, text, onPress, color = '#FF6B00' }) => (
  //   <TouchableOpacity style={styles.menuItem} onPress={onPress}>
  //     <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
  //       <Ionicons name={icon} size={22} color={color} />
  //     </View>
  //     <Text style={styles.menuText}>{text}</Text>
  //     <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
  //   </TouchableOpacity>
  // );
  const MenuItem = ({ icon, text, onPress, color = '#FF6B00' }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.menuText}>{text}</Text>
      <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
      style={styles.container}
    >
      <Text style={styles.title}>Configuración</Text>
      <ScrollView style={styles.scrollContainer}>
        {/* Encabezado con logo */}
        {/* <View style={styles.header}>
          <Image
            source={require("../assets/logo4.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View> */}

        {/* Sección de configuración */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>MI CUENTA</Text>
          <MenuItem 
            icon="person-outline" 
            text="Perfil de usuario" 
            onPress={() => navigation.navigate("Perfil")}
          />
          <MenuItem 
            icon="lock-closed-outline" 
            text="Cambiar mi contraseña" 
            onPress={() => setShowPasswordModal(true)}
          />
        </View> */}

        {/* Sección de información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INFORMACIÓN</Text>
          <MenuItem 
            icon="information-circle-outline" 
            text="Quiénes somos" 
            onPress={() => navigation.navigate("Contactos")}
          />
          <MenuItem 
            icon="help-circle-outline" 
            text="Ayuda y soporte" 
            onPress={() => navigation.navigate("Ayuda")}
          />
          {/* <MenuItem 
            icon="share-outline" 
            text="Compartir" 
            onPress={() => navigation.navigate("Compartir")}
          /> */}
        </View>

        {/* Sección de sesión */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SESIÓN</Text>
          <MenuItem 
            icon="log-out-outline" 
            text="Cerrar sesión" 
            color="#FF6B00"
            onPress={handleLogout}
          />
        </View>

        {/* Footer con versión */}
        <View style={styles.footer}>
          <Text style={styles.versionText}>Imperio {Constants.expoConfig.version}</Text>
        </View>
      </ScrollView>

      {/* Modal para cambiar contraseña
//       <Modal
//         visible={showPasswordModal}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={() => setShowPasswordModal(false)}
//       >
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={styles.modalContainer}
//         >
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
            
//             {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
//             <TextInput
//               style={styles.input}
//               placeholder="Contraseña actual"
//               placeholderTextColor="#999"
//               secureTextEntry
//               value={currentPassword}
//               onChangeText={setCurrentPassword}
//             />
            
//             <TextInput
//               style={styles.input}
//               placeholder="Nueva contraseña"
//               placeholderTextColor="#999"
//               secureTextEntry
//               value={newPassword}
//               onChangeText={setNewPassword}
//             />
            
//             <TextInput
//               style={styles.input}
//               placeholder="Confirmar nueva contraseña"
//               placeholderTextColor="#999"
//               secureTextEntry
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//             />
            
//             <View style={styles.modalButtons}>
//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.cancelButton]}
//                 onPress={() => setShowPasswordModal(false)}
//               >
//                 <Text style={styles.buttonText}>Cancelar</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity 
//                 style={[styles.modalButton, styles.confirmButton]}
//                 onPress={handleChangePassword}
//               >
//                 <Text style={styles.buttonText}>Cambiar</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </KeyboardAvoidingView>
//       </Modal>
//     </LinearGradient>
//   );
// }; */}
      {/* Modal para cambiar contraseña */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar contraseña</Text>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña actual"
                placeholderTextColor="#999"
                secureTextEntry={!showCurrentPassword}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons 
                  name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons 
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Confirmar nueva contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.buttonTextPas}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleChangePassword}
              >
                <Text style={styles.buttonText}>Cambiar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    paddingTop: 0,
  },
  passwordInputContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#FAFAFA',
    color: '#333',
    paddingRight: 40, // Espacio para el icono del ojo
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a3a8f',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmButton: {
    backgroundColor: '#FF6B00',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color:"#fff",
    // textShadowColor: "#fff"
  },
  buttonTextPas: {
    fontWeight: 'bold',
    fontSize: 16,
    color:"#000",
    // textShadowColor: "#fff"
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    // paddingHorizontal: 10,
    paddingTop: 20,
  },
  scrollContainer: {
    flex: 1,
    padding: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 50,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 15,
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 25,
    marginTop: 10,
  },
  versionText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
});

export default SettingsScreen;

// import { Alert, View, StyleSheet, TouchableOpacity, Text } from "react-native";
// import { useUser } from "./UserContext";
// import { LinearGradient } from 'expo-linear-gradient';
// import { Ionicons } from "@expo/vector-icons";

// const SettingsScreen = ({ navigation }) => {
//   const { logout } = useUser();

//   const handleLogout = () => {
//     Alert.alert("Cerrar sesión", "¿Estás seguro?", [
//       { text: "Cancelar", style: "cancel" },
//       { text: "Sí", onPress: () => logout() },
//     ]);
//   };

//   // Configuración de los botones en una sola fila con 4 columnas
//   const buttons = [
//     {
//       title: "Ajustes",
//       icon: "settings-sharp",
//       // onPress: () => navigation.navigate('SettingsDetails'),
//       color: "#192f6a"
//     },
//     {
//       title: "Perfil",
//       icon: "person-circle",
//       onPress: () => navigation.navigate('Perfil'),
//       color: "#3b5998"
//     },
//     {
//       title: "Notificaciones",
//       icon: "notifications",
//       // onPress: () => navigation.navigate('Notifications'),
//       color: "#1a3a8f"
//     },
//     {
//       title: "Cerrar sesión",
//       icon: "exit-outline",
//       onPress: handleLogout,
//       color: "#4c669f"
//     },
//   ];

//   return (
//     <LinearGradient
//       colors={["#1a3a8f", "#2a4a9f", "#3b5998"]}
//       style={styles.container}
//     >
//       <View style={styles.content}>
//         <Text style={styles.title}>Configuración</Text>

//         {/* Fila única con 4 botones */}
//         <View style={styles.buttonsContainer}>
//           {buttons.map((button, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[styles.button, { backgroundColor: button.color }]}
//               onPress={button.onPress}
//             >
//               <Ionicons name={button.icon} size={28} color="white" />
//               <Text style={styles.buttonText}>{button.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   content: {
//     flex: 1,
//     paddingTop: 40,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 28,
//     color: "white",
//     fontWeight: "bold",
//     marginBottom: 40,
//     textAlign: 'center',
//   },
//   buttonsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//     flexWrap: 'wrap',
//   },
//   button: {
//     width: '23%', // 4 columnas con espacio entre ellas
//     aspectRatio: 1, // Mantiene forma cuadrada
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 15,
//     padding: 10,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 14, // Reducido para caber mejor
//     fontWeight: '600',
//     marginTop: 10,
//     textAlign: 'center',
//   },
// });

// export default SettingsScreen;
