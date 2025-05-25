import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Ajouter un petit délai pour s'assurer que le contexte de navigation est prêt
    const timer = setTimeout(() => {
      try {
        router.replace('/playground' as any);
      } catch (error) {
        console.warn('Navigation error:', error);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return <View />;
}
