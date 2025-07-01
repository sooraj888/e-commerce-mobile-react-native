/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { useEffect, useState } from 'react';
import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [message, setMessage] = useState<any>({
    message: 'Calling test API...',
  });
  const callTestApi = async () => {
    console.log('Calling test API...');
    try {
      const response = await fetch('http://192.168.1.111:3000/test/3');
      const data = await response.json();
      setMessage(data);
      console.log('API Response:', data);
    } catch (error) {
      console.log('Error calling API:', error);
    }
  };

  useEffect(() => {
    callTestApi();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text
        style={{
          color: isDarkMode ? 'white' : 'black',
          textAlign: 'center',
          marginTop: 20,
        }}
      >
        {JSON.stringify(message, null, 2)}
      </Text>
      <Button
        title="Call API"
        onPress={() => {
          setMessage({ message: 'Calling test API...' });

          callTestApi();
        }}
      ></Button>
      <NewAppScreen templateFileName="App.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
