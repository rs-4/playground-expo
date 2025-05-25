import React from 'react';
import { SafeAreaView, Platform } from 'react-native';
import ReminidersNotifications from '@/components/playground/ReminidersNotifications';

export default function ReminidersNotificationsScreen() {
  return (
    <SafeAreaView
      className="flex-1 bg-gray-900"
      style={{ paddingTop: Platform.OS === 'ios' ? 10 : 0 }}>
      <ReminidersNotifications />
    </SafeAreaView>
  );
}
