import React from 'react';
import { View, Text, TouchableHighlight, Image, StyleSheet } from 'react-native';

import logo from '../assets/images/logo.png';

export default function StartUpView({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
        <View style={{ height: 10 }}></View>
        <Text style={styles.title}>Drive with confidence.</Text>
        <Text style={styles.title}>Maintain with ease - your car care companion is here!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
        <View style={{ height: 10 }}></View>
        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#142F36',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: '25%',
  },
  logo: {
    width: '100%',
    height: 200,
    overflow: 'visible',
  },
  title: {
    marginTop:'25%',
    marginTop: 10,
    fontSize: 24,
    color:'#fff',
    textAlign:'center'
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: '45%',
    width: '120%',
    height: '100%',
  },
  button: {
    padding: 10,
    margin: 5,
    backgroundColor: '#E37D00',
    borderRadius: 5,
    width: '50%',
    borderColor: 'white',
    borderRadius: 4,
    marginLeft: '-12.5%',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  }
});
