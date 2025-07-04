import { useState } from 'react';
import { View, Text, DeviceEventEmitter, Button } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

export default function CartScreen() {
  const [tabVisible, setTabVisible] = useState(true);

  const toggleTabBar = () => {
    const newVisibility = !tabVisible;
    setTabVisible(newVisibility);
    DeviceEventEmitter.emit('toggleTabBar', newVisibility);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      }}
    >
      <Button
        title={tabVisible ? 'Hide Tab Bar' : 'Show Tab Bar'}
        onPress={toggleTabBar}
      />
    </View>
  );
}
