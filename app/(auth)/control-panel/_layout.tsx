import React from 'react';
import { Stack } from 'expo-router';

export default function ControlPanelLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#EA8519', // 🔥 Nuevo color de fondo
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'ADMIN' }} // Título para el index del panel de control
      />
      <Stack.Screen
        name="manage-users"
        options={{ title: 'ADMIN - Gestión de Usuarios' }} // Título para la gestión de usuarios
      />
    
      <Stack.Screen
        name="manage-files"
        options={{ title: 'ADMIN - Gestión de Archivos' }} // Título para la gestión de productos
      />
      
    </Stack>
  );
}
