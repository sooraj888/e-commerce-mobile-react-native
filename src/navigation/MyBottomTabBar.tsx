import {
  View,
  Text,
  StyleSheet,
  Easing,
  DeviceEventEmitter,
} from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import {
  createStaticNavigation,
  NavigationRoute,
  ParamListBase,
  useLinkBuilder,
  useTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import YouScreen from '../screens/You/YouScreen';
import CartScreen from '../screens/Cart/CartScreen';
import { PlatformPressable } from '@react-navigation/elements';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { tabBarHeight } from '../utils/tabBarHeight';

const Tab = createBottomTabNavigator();

export default function MyBottomTabBar() {
  const [showTabBar, setShowTabBar] = useState(true);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'toggleTabBar',
      (visible: boolean) => {
        setShowTabBar(visible);
      },
    );
    return () => sub.remove();
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="You" component={YouScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
    </Tab.Navigator>
  );
}

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  //Animation Variables
  // const height = useSharedValue(80);

  const animatedStyle = useAnimatedStyle(() => {
    ///intropolate border height
    const borderTopWidth = interpolate(tabBarHeight.value, [0, 80], [0, 1]);
    return { height: tabBarHeight.value, borderTopWidth };
  });
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'toggleTabBar',
      (visible: boolean) => {
        tabBarHeight.value = withTiming(visible ? 0 : 80, { duration: 300 });
      },
    );

    return () => sub.remove();
  }, []);

  return (
    <Animated.View
      style={[
        styles.tabBar,
        {
          borderTopColor: colors.border,
        },
        animatedStyle,
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={route.key}
          >
            {options.tabBarShowLabel && (
              <Text style={{ color: isFocused ? colors.primary : colors.text }}>
                {label.toString()}
              </Text>
            )}
          </PlatformPressable>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    borderTopWidth: 1,
    backgroundColor: 'white',
    height: 80,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
