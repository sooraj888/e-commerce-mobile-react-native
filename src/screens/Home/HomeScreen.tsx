// src/screens/HomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Button,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { tabBarHeight } from '../../utils/tabBarHeight';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { addAmount, increment } from '../../redux/slices/counterSlice';

const { width } = Dimensions.get('window');

const dummyData = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  title: `Product ${i + 1}`,
  image: 'https://via.placeholder.com/300x200.png?text=Product+' + (i + 1),
  price: `₹${(Math.random() * 1000 + 100).toFixed(0)}`,
}));

const HomeScreen = () => {
  const scrollY = useSharedValue(0);
  const lastScrollTime = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const counter = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      if (!tabBarHeight || tabBarHeight.value === undefined) return;
      const currentY = event.contentOffset.y;
      const currentTime = Date.now();
      const dy = currentY - scrollY.value;
      const dt = currentTime - lastScrollTime.value;

      if (dt === 0) return;

      const speed = Math.abs(dy / dt); // pixels per ms

      const speedThreshold = 0.5; // tweak this if needed
      if (dy < 0) {
        tabBarHeight.value = withTiming(80, { duration: 300 });
      }
      if (speed > speedThreshold) {
        if (dy > 0) {
          tabBarHeight.value = withTiming(0, { duration: 300 });
        }
      }

      scrollY.value = currentY;
      lastScrollTime.value = currentTime;
    },
  });

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      contentContainerStyle={styles.container}
      style={{ paddingTop: insets.top }}
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        {counter}
      </Text>
      <Button title="Increment" onPress={() => dispatch(increment())} />

      <Button title="Add" onPress={() => dispatch(addAmount(100))} />

      {dummyData.map(item => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      ))}
    </Animated.ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100, // so content doesn't get hidden behind tab bar
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  image: {
    width: width - 64,
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});
