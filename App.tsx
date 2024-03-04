import 'react-native-gesture-handler'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { Navigator } from './src/navigator/Navigator'
import { AuthProvider } from './src/context/AuthContext'
import { SideMenu } from './src/navigator/SideMenu'

const AppState = ({ children }: any) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
const App = () => {
  return (
    <NavigationContainer>
      <AppState>
        {/* <Navigator /> */}
        <SideMenu />
      </AppState>
    </NavigationContainer>
  )
}

export default App