import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  Platform,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout, SlideInRight } from 'react-native-reanimated';
import DarkGradientButton from '@/components/DarkGradientButton';

const ReminidersNotifications = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [customTimes, setCustomTimes] = useState<string[]>([]);

  const timeSlots = [
    { time: '9:00', label: 'Morning', description: 'Breakfast' },
    { time: '12:00', label: 'Noon', description: 'Lunch' },
    { time: '15:00', label: 'Afternoon', description: 'Snack' },
    { time: '20:00', label: 'Evening', description: 'Dinner' },
  ];

  // Select the first reminder by default at loading
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
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;

      // Add the custom time to the list
      if (!customTimes.includes(time)) {
        setCustomTimes([...customTimes, time]);
      }

      // Activate the reminder (automatically select it)
      if (!selectedHours.includes(time)) {
        toggleHour(time);
      }
    }
  };

  const handleConfirmTime = () => {
    const now = new Date();
    handleTimeSelected(
      {
        type: 'set',
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
      Alert.alert('No reminder', 'Please select at least one reminder');
      return;
    }
    Alert.alert('Success', 'Your reminders have been successfully configured');
  };

  const allTimeSlots = [
    ...timeSlots,
    ...customTimes.map((time) => ({
      time,
      label: 'Custom',
      description: 'Reminder',
    })),
  ];

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 500);
  }, [allTimeSlots.length]);

  return (
    <SafeAreaView className="android:pt-[30px] flex-1 bg-[#f5f5f7] pt-[50px]">
      <View className="android:pb-[100px] w-full flex-1 p-4 pb-[120px] pt-5">
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text className="mb-6 mt-3 w-full text-2xl font-bold text-[#1c1c1e]">
            Notifications 🔔
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          layout={Layout.springify()}
          className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/5">
          <View className="flex-row items-center border-b border-[#f2f2f7] p-4">
            <View className="mr-3 h-8 w-8 items-center justify-center rounded-lg bg-[#007aff]">
              <MaterialCommunityIcons name="bell" size={20} color="white" />
            </View>
            <Text className="text-[17px] font-semibold text-[#1c1c1e]">Daily reminders</Text>
          </View>

          <View className="h-[400px]">
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}>
              <View className="flex-row flex-wrap gap-3 p-3 pb-6">
                {allTimeSlots.map((slot, index) => (
                  <View key={slot.time} className="mb-3 h-[100px] w-[48%]">
                    <Animated.View
                      entering={SlideInRight.delay(index * 10).springify()}
                      layout={Layout.springify()}>
                      <TouchableOpacity
                        className={`h-full ${
                          selectedHours.includes(slot.time)
                            ? 'bg-[#007AFF] shadow-md shadow-black/20'
                            : 'bg-[#f2f2f7]'
                        } items-center justify-center rounded-2xl p-4`}
                        onPress={() => toggleHour(slot.time)}>
                        <Text
                          className={`${
                            selectedHours.includes(slot.time) ? 'text-white' : 'text-[#1c1c1e]'
                          } text-base font-semibold`}>
                          {slot.time}
                        </Text>
                        <Text
                          className={`${
                            selectedHours.includes(slot.time) ? 'text-white/80' : 'text-[#8e8e93]'
                          } mt-1 text-center text-xs`}>
                          {slot.label} - {slot.description}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                ))}

                <View className="mb-3 h-[100px] w-[48%]">
                  <Animated.View
                    entering={SlideInRight.delay(allTimeSlots.length * 50).springify()}
                    layout={Layout.springify()}>
                    <TouchableOpacity
                      className="h-full items-center justify-center rounded-2xl border-2 border-dashed border-[#007AFF] bg-[#f2f2f7] p-4"
                      onPress={handleAddCustomTime}>
                      <MaterialCommunityIcons name="plus" size={24} color="#007AFF" />
                      <Text className="text-base font-semibold text-[#007AFF]">Custom</Text>
                      <Text className="mt-1 text-center text-xs text-[#007AFF]">Add a time</Text>
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
          className="mb-4 flex-row items-center rounded-2xl bg-white p-4">
          <View className="mr-3 h-8 w-8 items-center justify-center rounded-lg bg-[#34c759]">
            <MaterialCommunityIcons name="information" size={20} color="white" />
          </View>
          <Text className="flex-1 text-[15px] text-[#1c1c1e]">
            Activate notifications so you don't forget to log your meals
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <DarkGradientButton title="Save reminders" onPress={handleValidate} />
        </Animated.View>

        {/* Time Picker Modal for iOS */}
        {Platform.OS === 'ios' ? (
          <Modal visible={showTimePicker} transparent={true} animationType="slide">
            <TouchableOpacity
              className="flex-1"
              activeOpacity={1}
              onPress={() => setShowTimePicker(false)}>
              <View className="absolute bottom-0 left-0 right-0 items-center rounded-t-xl bg-[#f2f2f7] p-4">
                <View className="mb-4 w-full flex-row items-center justify-between p-2">
                  <TouchableOpacity
                    className="min-w-[60px] items-center p-2"
                    onPress={() => setShowTimePicker(false)}>
                    <Text className="text-[17px] font-semibold text-[#8e8e93]">Cancel</Text>
                  </TouchableOpacity>
                  <Text className="flex-1 text-center text-[17px] font-semibold text-[#1c1c1e]">
                    Choose a time
                  </Text>
                  <TouchableOpacity
                    className="min-w-[60px] items-center p-2"
                    onPress={handleConfirmTime}>
                    <Text className="text-[17px] font-semibold text-[#007AFF]">OK</Text>
                  </TouchableOpacity>
                </View>
                <View className="w-full items-center p-4">
                  <DateTimePicker
                    value={selectedDate}
                    mode="time"
                    display="spinner"
                    onChange={(event: any, date?: Date) => {
                      if (date) setSelectedDate(date);
                    }}
                    minuteInterval={5}
                    style={{ width: '100%', height: 200 }}
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

export default ReminidersNotifications;
