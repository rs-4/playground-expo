import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedStyle,
  Easing,
  interpolate,
  withSpring,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

// Obtenir les dimensions de l'écran
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Calcul des dimensions relatives pour s'adapter à tous les appareils
const SCALE_FACTOR = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 390; // Base sur iPhone 13
const responsiveSize = (size: number) => size * SCALE_FACTOR;

// Constants - Dimensions adaptatives
const DYNAMIC_ISLAND_HEIGHT = responsiveSize(40);
const DYNAMIC_ISLAND_MIN_WIDTH = responsiveSize(134);
const DYNAMIC_ISLAND_MAX_WIDTH = Math.min(responsiveSize(370), SCREEN_WIDTH * 0.9);
const DYNAMIC_ISLAND_EXPANDED_HEIGHT = responsiveSize(100);
const ANIMATION_DURATION = 350;

// Seuil de glissement pour fermer la notification (en pixels)
const SWIPE_THRESHOLD = -30;

// Position dynamique selon la taille de l'écran et la plateforme
const ISLAND_TOP = Platform.OS === 'ios' ? responsiveSize(50) : responsiveSize(25);

// Animation configs
const TIMING_CONFIG = {
  duration: ANIMATION_DURATION,
  easing: Easing.bezier(0.33, 1, 0.68, 1),
};

// Spring config pour l'effet de rebond
const SPRING_CONFIG = {
  damping: 12,
  stiffness: 100,
  mass: 1,
  overshootClamping: false,
};

export default function DynamicIslandNotification() {
  const [notificationActive, setNotificationActive] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const { width: windowWidth } = useWindowDimensions();

  // Valeurs d'animation
  const expansion = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const bounce = useSharedValue(1);
  const textVisible = useSharedValue(false);

  // Réinitialiser les animations au démarrage
  useEffect(() => {
    expansion.value = 0;
    textOpacity.value = 0;
    bounce.value = 1;
  }, []);

  // Afficher une notification avec un rebond
  const showNotification = (message: string) => {
    setNotificationText(message);
    setNotificationActive(true);
    textVisible.value = true;

    try {
      // Animation progressive pour éviter les crashs
      expansion.value = 0;
      bounce.value = 1;

      setTimeout(() => {
        // Animation d'expansion avec un effet de spring
        expansion.value = withSpring(1, SPRING_CONFIG);

        // Léger effet de rebond
        bounce.value = withSpring(1.05, {
          damping: 8,
          stiffness: 150,
          mass: 0.5,
        });

        setTimeout(() => {
          // Retour à la taille normale après le rebond
          bounce.value = withSpring(1, {
            damping: 15,
            stiffness: 150,
          });

          // Faire apparaître le texte
          textOpacity.value = withTiming(1, { duration: ANIMATION_DURATION / 2 });

          // Auto-fermeture après 3 secondes
          setTimeout(() => {
            hideNotification();
          }, 3000);
        }, ANIMATION_DURATION / 2);
      }, 50);
    } catch (error) {
      console.log('Animation error:', error);
    }
  };

  // Cacher la notification avec animation
  const hideNotification = () => {
    try {
      if (!textVisible.value) return; // Éviter les animations multiples

      // D'abord, faire disparaître le texte complètement
      textOpacity.value = withTiming(
        0,
        {
          duration: ANIMATION_DURATION / 2,
        },
        () => {
          runOnJS(startIslandAnimation)();
        }
      );

      textVisible.value = false;
    } catch (error) {
      console.log('Animation error:', error);
      setNotificationActive(false);
    }
  };

  // Animation de fermeture de l'île, appelée après que le texte ait disparu
  const startIslandAnimation = () => {
    try {
      // Léger effet de rebond à la fermeture
      bounce.value = withSpring(0.95, {
        damping: 10,
        stiffness: 150,
        mass: 0.5,
      });

      setTimeout(() => {
        bounce.value = withSpring(1, {
          damping: 15,
          stiffness: 150,
        });
        expansion.value = withSpring(0, SPRING_CONFIG, () => {
          runOnJS(setNotificationActive)(false);
        });
      }, ANIMATION_DURATION / 4);
    } catch (error) {
      console.log('Animation error:', error);
      setNotificationActive(false);
    }
  };

  // Gestionnaire pour le geste de glissement
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = 0;
    },
    onActive: (event, ctx: any) => {
      // Détecter uniquement le glissement vers le haut (valeur négative)
      if (event.translationY < 0) {
        ctx.currentY = event.translationY;
      }
    },
    onEnd: (event, ctx: any) => {
      // Si le glissement vers le haut dépasse le seuil
      if (ctx.currentY && ctx.currentY < SWIPE_THRESHOLD) {
        runOnJS(hideNotification)();
      }
    },
  });

  // Styles animés
  const dynamicIslandStyle = useAnimatedStyle(() => {
    const width = interpolate(
      expansion.value,
      [0, 1],
      [DYNAMIC_ISLAND_MIN_WIDTH, DYNAMIC_ISLAND_MAX_WIDTH]
    );

    const height = interpolate(
      expansion.value,
      [0, 1],
      [DYNAMIC_ISLAND_HEIGHT, DYNAMIC_ISLAND_EXPANDED_HEIGHT]
    );

    // Calcul du border radius qui diminue quand l'île s'agrandit
    const borderRadius = interpolate(
      expansion.value,
      [0, 1],
      [responsiveSize(24), responsiveSize(37)]
    );

    // Appliquer l'effet de scale pour le rebond
    const scale = bounce.value;

    return {
      width,
      height,
      borderRadius,
      position: 'absolute',
      top: ISLAND_TOP,
      left: (windowWidth - width) / 2,
      transform: [{ scale }],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: textOpacity.value,
      transform: [
        {
          translateY: interpolate(textOpacity.value, [0, 1], [responsiveSize(10), 0]),
        },
      ],
    };
  });

  // Déclenchement des notifications
  const triggerMusicNotification = () => {
    showNotification('🎵 Musique en cours - Daft Punk');
  };

  const triggerCallNotification = () => {
    showNotification('📞 Appel entrant - Thomas');
  };

  const triggerMessageNotification = () => {
    showNotification('💬 Nouveau message - Julie');
  };

  const triggerTimerNotification = () => {
    showNotification('⏱️ Minuteur terminé - 5:00');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Dynamic Island en haut de l'écran, centrée */}
      <PanGestureHandler onGestureEvent={gestureHandler} enabled={notificationActive}>
        <Animated.View style={[styles.dynamicIsland, dynamicIslandStyle]}>
          {/* Contenu de la Dynamic Island */}
          {notificationActive && (
            <Animated.View style={[styles.notificationContent, contentStyle]}>
              <Text style={styles.notificationText}>{notificationText}</Text>
            </Animated.View>
          )}
        </Animated.View>
      </PanGestureHandler>

      {/* Boutons pour déclencher les animations */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.musicButton]}
          onPress={triggerMusicNotification}>
          <Text style={styles.buttonText}>🎵 Musique</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.callButton]}
          onPress={triggerCallNotification}>
          <Text style={styles.buttonText}>📞 Appel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.messageButton]}
          onPress={triggerMessageNotification}>
          <Text style={styles.buttonText}>💬 Message</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.timerButton]}
          onPress={triggerTimerNotification}>
          <Text style={styles.buttonText}>⏱️ Minuteur</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  dynamicIsland: {
    backgroundColor: '#000',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 10000,
  },
  notificationContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: responsiveSize(24),
    paddingVertical: responsiveSize(16),
  },
  notificationText: {
    color: '#FFF',
    fontSize: responsiveSize(16),
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: responsiveSize(100),
    left: 0,
    right: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: responsiveSize(15),
  },
  button: {
    paddingVertical: responsiveSize(12),
    paddingHorizontal: responsiveSize(24),
    borderRadius: responsiveSize(12),
    minWidth: responsiveSize(180),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: responsiveSize(16),
    fontWeight: '600',
    color: '#FFF',
  },
  musicButton: {
    backgroundColor: '#8A2BE2',
  },
  callButton: {
    backgroundColor: '#4CD964',
  },
  messageButton: {
    backgroundColor: '#007AFF',
  },
  timerButton: {
    backgroundColor: '#FF9500',
  },
});
