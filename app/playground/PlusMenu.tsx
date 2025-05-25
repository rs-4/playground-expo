import React from 'react';
import PlusMenu from '@/components/playground/PlusMenu';
import { ThemedView } from '@/components/ThemedView';

export default function PlusMenuScreen() {
  return (
    <ThemedView className="flex-1">
      <PlusMenu />
    </ThemedView>
  );
}
