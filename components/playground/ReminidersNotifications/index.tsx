import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Alert,
  Platform,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  Layout,
  SlideInRight,
} from "react-native-reanimated";
import DarkGradientButton from "@/components/DarkGradientButton";

const ReminidersNotifications = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customTimes, setCustomTimes] = useState<string[]>([]);

  const timeSlots = [
    { time: "9:00", label: "Morning", description: "Breakfast" },
    { time: "12:00", label: "Noon", description: "Lunch" },
    { time: "15:00", label: "Afternoon", description: "Snack" },
    { time: "20:00", label: "Evening", description: "Dinner" },
  ];

  // Sélectionner le premier rappel par défaut au chargement
  useEffect(() => {
    if (timeSlots.length > 0 && selectedHours.length === 0) {
      toggleHour(timeSlots[0].time);
    }
  }, []);

  const toggleHour = (time: string) => {
    setSelectedHours((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleAddCustomTime = () => {
    setShowTimePicker(true);
  };

  const handleTimeSelected = (event: any, date?: Date) => {
    setShowTimePicker(false);
    if (date) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const time = `${hours}:${minutes}`;

      // Ajouter le temps personnalisé à la liste
      if (!customTimes.includes(time)) {
        setCustomTimes([...customTimes, time]);
      }

      // Activer le rappel (sélectionner automatiquement)
      if (!selectedHours.includes(time)) {
        toggleHour(time);
      }
    }
  };

  const handleConfirmTime = () => {
    const now = new Date();
    handleTimeSelected(
      {
        type: "set",
        nativeEvent: {
          timestamp: selectedDate.getTime(),
          utcOffset: now.getTimezoneOffset() * -60000, // Conversion en millisecondes
        },
      },
      selectedDate
    );
  };

  const handleValidate = () => {
    if (selectedHours.length === 0) {
      Alert.alert("No reminder", "Please select at least one reminder");
      return;
    }
    Alert.alert("Success", "Your reminders have been successfully configured");
  };

  const allTimeSlots = [
    ...timeSlots,
    ...customTimes.map((time) => ({
      time,
      label: "Custom",
      description: "Reminder",
    })),
  ];

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 500);
  }, [allTimeSlots.length]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.title}>Notifications 🔔</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          layout={Layout.springify()}
          style={styles.notificationCard}
        >
          <View style={styles.notificationHeader}>
            <View style={styles.notificationIcon}>
              <MaterialCommunityIcons name="bell" size={20} color="white" />
            </View>
            <Text style={styles.notificationTitle}>Daily reminders</Text>
          </View>

          <View style={styles.timeGrid}>
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <View style={styles.timeGridContent}>
                {allTimeSlots.map((slot, index) => (
                  <View key={slot.time} style={styles.timeSlotWrapper}>
                    <Animated.View
                      entering={SlideInRight.delay(index * 10).springify()}
                      layout={Layout.springify()}
                    >
                      <TouchableOpacity
                        style={[
                          styles.timeSlot,
                          selectedHours.includes(slot.time) &&
                            styles.timeSlotSelected,
                        ]}
                        onPress={() => toggleHour(slot.time)}
                      >
                        <Text
                          style={[
                            styles.timeSlotText,
                            selectedHours.includes(slot.time) &&
                              styles.timeSlotTextSelected,
                          ]}
                        >
                          {slot.time}
                        </Text>
                        <Text
                          style={[
                            styles.timeSlotSubtext,
                            selectedHours.includes(slot.time) &&
                              styles.timeSlotSubtextSelected,
                          ]}
                        >
                          {slot.label} - {slot.description}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                ))}

                <View style={styles.timeSlotWrapper}>
                  <Animated.View
                    entering={SlideInRight.delay(
                      allTimeSlots.length * 50
                    ).springify()}
                    layout={Layout.springify()}
                  >
                    <TouchableOpacity
                      style={[styles.timeSlot, styles.timeSlotCustom]}
                      onPress={handleAddCustomTime}
                    >
                      <MaterialCommunityIcons
                        name="plus"
                        size={24}
                        color="#007AFF"
                      />
                      <Text style={styles.timeSlotTextCustom}>Custom</Text>
                      <Text style={styles.timeSlotSubtextCustom}>
                        Add a time
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              </View>
            </ScrollView>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          layout={Layout.springify()}
          style={styles.infoCard}
        >
          <View style={styles.infoIcon}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color="white"
            />
          </View>
          <Text style={styles.infoText}>
            Activate notifications so you don't forget to log your meals
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <DarkGradientButton title="Save reminders" onPress={handleValidate} />
        </Animated.View>

        {/* Time Picker Modal pour iOS */}
        {Platform.OS === "ios" ? (
          <Modal
            visible={showTimePicker}
            transparent={true}
            animationType="slide"
          >
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={1}
              onPress={() => setShowTimePicker(false)}
            >
              <View style={styles.timePickerContainer}>
                <View style={styles.timePickerHeader}>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={() => setShowTimePicker(false)}
                  >
                    <Text style={styles.timePickerButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.timePickerTitle}>Choose a time</Text>
                  <TouchableOpacity
                    style={styles.timePickerButton}
                    onPress={handleConfirmTime}
                  >
                    <Text
                      style={[
                        styles.timePickerButtonText,
                        styles.timePickerButtonTextPrimary,
                      ]}
                    >
                      OK
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.timePickerContent}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="time"
                    display="spinner"
                    onChange={(event: any, date?: Date) => {
                      if (date) setSelectedDate(date);
                    }}
                    minuteInterval={5}
                    style={{ width: "100%", height: 200 }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        ) : (
          showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="default"
              onChange={handleTimeSelected}
              minuteInterval={5}
            />
          )
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 120 : 100,
    flex: 1,
    width: "100%",
  },
  title: {
    width: "100%",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 12,
    color: "#1c1c1e",
  },
  notificationCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  notificationHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
    flexDirection: "row",
    alignItems: "center",
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#007aff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  timeGrid: {
    height: 400,
  },
  timeGridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 12,
    paddingBottom: 24,
  },
  timeSlotWrapper: {
    width: "48%",
    height: 100,
    marginBottom: 12,
  },
  timeSlot: {
    height: "100%",
    backgroundColor: "#f2f2f7",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  timeSlotSelected: {
    backgroundColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  timeSlotCustom: {
    backgroundColor: "#f2f2f7",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#007AFF",
  },
  timeSlotText: {
    color: "#1c1c1e",
    fontSize: 16,
    fontWeight: "600",
  },
  timeSlotTextSelected: {
    color: "white",
  },
  timeSlotTextCustom: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  timeSlotSubtext: {
    color: "#8e8e93",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  timeSlotSubtextSelected: {
    color: "rgba(255,255,255,0.8)",
  },
  timeSlotSubtextCustom: {
    color: "#007AFF",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#34c759",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#1c1c1e",
    flex: 1,
  },
  timePickerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f2f2f7",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  timePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
    padding: 8,
  },
  timePickerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1c1c1e",
    flex: 1,
    textAlign: "center",
  },
  timePickerButton: {
    padding: 8,
    minWidth: 60,
    alignItems: "center",
  },
  timePickerButtonText: {
    color: "#8e8e93",
    fontSize: 17,
    fontWeight: "600",
  },
  timePickerButtonTextPrimary: {
    color: "#007AFF",
  },
  timePickerContent: {
    width: "100%",
    alignItems: "center",
    padding: 16,
  },
});

export default ReminidersNotifications;
