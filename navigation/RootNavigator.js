// Implementacion con tiempo

import { useState, useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox, SafeAreaView, View } from "react-native";
import AuthStack from "./AuthStack";
import AnonymousStack from "./AnonymousStack";
import MainStack from "./MainStack";
import { useUser } from "../screens/UserContext";
import LoadingScreen from "../screens/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AdminScreen from "./AdminScreen";
import { AppState, BackHandler } from "react-native";
import GestorStack from "./GestorStack";

// Ignorar advertencias específicas
LogBox.ignoreLogs([
  "Invariant Violation: Tried to register two views with the same name RNCPicker",
]);

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

export default function RootNavigator() {
  const { user, loading: userLoading, logout } = useUser();
  const [authChecked, setAuthChecked] = useState(false);
  const inactivityTimer = useRef(null);
  const appState = useRef(AppState.currentState);

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    inactivityTimer.current = setTimeout(() => {
      // handleLogout();
    }, INACTIVITY_TIMEOUT);
  };

  const handleLogout = async () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }
    await logout();
    BackHandler.exitApp();
  };

  // Efecto para manejar el estado de la aplicación
  useEffect(() => {
    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          resetInactivityTimer();
        } else if (nextAppState === "background") {
          if (inactivityTimer.current) {
            clearTimeout(inactivityTimer.current);
          }
        }
        appState.current = nextAppState;
      }
    );

    return () => {
      appStateSubscription.remove();
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("userData");

        if (isMounted) {
          setAuthChecked(true);
          if (storedUser) {
            resetInactivityTimer();
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        if (isMounted) {
          setAuthChecked(true);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Efecto para reiniciar temporizador cuando cambia el usuario
  useEffect(() => {
    if (user) {
      resetInactivityTimer();
    } else {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    }
  }, [user]);

  // Si aún estamos cargando o verificando autenticación
  if (!authChecked) {
    return <LoadingScreen />;
  }

  // Versión simplificada sin NavigationContainer duplicado

  // switch (user?.rol) {
  //   case 1: return <AdminScreen />;
  //   case 2: return <MainStack />;
  //   case 3: return <MainStack />;
  //   case 4: return <AnonymousStack />;
  //   default: return <AuthStack />;
  // }
  return (
    <View style={{ flex: 1 }}>
        <NavigationContainer style={{ flex: 1 }}>
          {(() => {
            switch (user?.rol) {
              case 1:
                return <AdminScreen />;
              case 2:
                return <GestorStack />;
              case 3:
                return <MainStack />;
              case 4:
                return <AnonymousStack />;
              default:
                return <AuthStack />;
            }
          })()}
        </NavigationContainer>
    </View>
  );
}
