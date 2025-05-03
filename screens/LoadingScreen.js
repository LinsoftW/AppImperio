import { ActivityIndicator, Image, StyleSheet, View, Text } from 'react-native';

export default LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/LogoImperio.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <ActivityIndicator 
        size="large" 
        // color={colors.primary}
      />
      <Text style={styles.text}>Inicializando aplicación...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 100,
    marginBottom: 30,
  },
  // ...otros estilos
});