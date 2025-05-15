import * as Haptics from 'expo-haptics';

/**
 * Little helper that lets you describe a haptic feedback pattern as a
 *   sequence of characters and pauses:
 *   - "o" ➜ medium impact
 *   - "O" ➜ heavy impact
 *   - "." ➜ light impact
 *   - number ➜ pause in ms
 */
export async function hapticWithSequence(sequence: Array<string | number>) {
  const hapticMap: Record<string, () => Promise<void>> = {
    o: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    O: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
    '.': () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  };

  for (const item of sequence) {
    if (typeof item === 'number') {
      await new Promise((resolve) => setTimeout(resolve, item));
    } else {
      await hapticMap[item]?.();
    }
  }
}
