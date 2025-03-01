import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

function App() {
  console.log('App is running');
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;