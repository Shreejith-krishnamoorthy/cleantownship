import React, {useState, useRef} from 'react';
import {View, StyleSheet, Text, ImageBackground,Image, Alert} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';
import {TextInput, Button} from 'react-native-paper';
import {useNavigation, useTheme} from '@react-navigation/native';
import {ROUTES_NAME, SESSION_DATA} from '../utlis/constants';
import SnackBar from '../components/SnackBar';
const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
  password: yup
    .string()
    .min(8, ({min}) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  // .matches(/\w*[a-z]\w*/,  "Password must have a small letter")
  // .matches(/\w*[A-Z]\w*/,  "Password must have a capital letter")
  // .matches(/\d/, "Password must have a number")
  // .matches(/[!@#$%^&*()\-_"=+{}; :,<.>]/, "Password must have a special character")
});

const LoginScreen = () => {
  const {colors} = useTheme();
  const navigation = useNavigation();
  const formikRef = useRef();
  const [formSubmitSuccessful, setFormSubmitSuccessful] = useState(false);
  const formSubmit = ({email,password}) => {
    if(email===SESSION_DATA.adminEmail)
    {
      if(password!==SESSION_DATA.adminPassword)
      {
        Alert.alert("Information","Invalid password");
        return false;
      }
    }
    SESSION_DATA.email=email;
    SESSION_DATA.password=password;
    setFormSubmitSuccessful(true);
    setTimeout(() => {
      formikRef.current?.resetForm();
      navigation.replace(ROUTES_NAME.DASH.name);
    }, 3000);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/login-bg-2.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.container1}>
      
          <View style={styles.loginContainer}>
          <Image
        style={{width:'80%',height:'20%',paddingLeft:20}}
        source={require('../assets/images/title_1.png')}
      />
            <Formik
              innerRef={formikRef}
              validationSchema={loginValidationSchema}
              initialValues={{email: '', password: ''}}
              onSubmit={formSubmit}
              validateOnMount={true}
              >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isValid,
                touched,
              }) => (
                <>
                  <TextInput
                    mode="outlined"
                    name="email"
                    label="Email Address"
                    placeholder="Email Address"
                    style={styles.textInput}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}

                  <TextInput
                    mode="outlined"
                    name="password"
                    placeholder="Password"
                    label="Password"
                    style={styles.textInput}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry
                  />
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                  <Button
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={isValid ? false : true}
                    buttonColor={isValid ? colors.green : colors.disabled}
                    style={{width: '70%', marginVertical: '5%'}}>
                    LOGIN
                  </Button>
                </>
              )}
            </Formik>
            {formSubmitSuccessful && (
              <SnackBar
                message={'Logged in successfully'}
                show={formSubmitSuccessful}
                timeout={2000}
              />
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    elevation: 10,
    borderRadius: 5,
  },
  textInput: {
    height: 40,
    width: '100%',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
  },
  image: {
    flex: 1,
  },
});

export default LoginScreen;
