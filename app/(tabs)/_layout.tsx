import { useAuth } from '@/components/context/auth-context';
import { HapticTab } from '@/components/ui/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

export default function TabLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace('/login'); // o router.replace('/auth/login') según ruta
  }, [user, router]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.icon,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tareas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="list.bullet.clipboard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
