import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  BackHandler,
  Alert,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import {
  AnimatedFAB,
  Avatar,
  IconButton,
  Card,
  List,
  Text,
  MD3Colors,
  FAB,
  Portal,
  PaperProvider,
} from 'react-native-paper';
import {ROUTES_NAME, SESSION_DATA} from '../utlis/constants';
import {getData} from '../utlis/DataApi';
import {useIsFocused, useTheme} from '@react-navigation/native';
const DashboardScreen = ({navigation}) => {
  const {colors} = useTheme();
  const [data, setData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const isAdmin = SESSION_DATA.email === 'admin@cleantownship.com';
  const isFocused = useIsFocused();
  useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="logout"
          iconColor={MD3Colors.error50}
          size={24}
          onPress={logoutSession}
        />
      ),
    });
  }, [navigation]);
  useEffect(() => {
    if (isFocused) {
      getIssueDetails();
    }
  }, [isFocused]);
  useEffect(() => {
    const backAction = () => {
      logoutSession();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const logoutSession = () => {
    Alert.alert('Hold on!', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => navigation.navigate(ROUTES_NAME.LOGIN.name),
      },
    ]);
  };
  const getIssueDetails = async () => {
    let data = await getData();
    setUsersData(data[SESSION_DATA.email] || []);
    if (isAdmin) {
      setData(data || []);
    }
  };

  const renderListItem = userData => {
    return userData.map(({address, desc, image, datetime, coords}, index) => {
      return (
        <List.Accordion
          title={`Ticket No # ${index + 1}`}
          style={{
            borderColor: 'grey',
            borderWidth: 0.5,
            marginHorizontal: 5,
            marginVertical: 5,
            borderRadius: 5,
          }}
          key={index}>
          <Card
            mode="elevated"
            style={{marginHorizontal: 10, marginVertical: 10}}
            elevation={2}>
            <Card.Content>
              <List.Item
                title={address}
                titleNumberOfLines={10}
                left={props => (
                  <List.Icon {...props} icon="camera" color="green" />
                )}
                style={{marginLeft: -15, marginTop: -15, marginRight: -15}}
              />
              <List.Item
                title={desc}
                left={props => (
                  <List.Icon
                    {...props}
                    icon="format-list-bulleted"
                    color="green"
                  />
                )}
                style={{marginLeft: -15, marginTop: -15, marginRight: -15}}
                titleNumberOfLines={10}
              />
              <List.Item
                title={datetime}
                left={props => (
                  <List.Icon
                    {...props}
                    icon="clock-time-four-outline"
                    color="green"
                  />
                )}
                style={{marginLeft: -15, marginTop: -15, marginRight: -15}}
              />
              <List.Item
                title={coords}
                titleNumberOfLines={2}
                left={props => (
                  <List.Icon {...props} icon="google-maps" color="green" />
                )}
                style={{marginLeft: -15, marginTop: -15, marginRight: -15}}
              />
              {image?.raw && (
                <Image
                  style={{width: '100%', height: 250}}
                  source={{uri: image?.raw?.uri}}
                />
              )}
            </Card.Content>
          </Card>
        </List.Accordion>
      );
    });
  };
  const renderUserListItem = userWiseData => {
    return Object.keys(userWiseData).map((value, index) => {
      return (
        <List.Accordion
          title={`User-${index + 1}`}
          style={{
            borderColor: 'grey',
            borderWidth: 0.5,
            marginHorizontal: 5,
            marginVertical: 5,
            borderRadius: 5,
          }}
          key={index}>
          <View style={{marginHorizontal: 10}}>
            {renderListItem(userWiseData[value])}
          </View>
        </List.Accordion>
      );
    });
  };
  const dataLength = Object.keys(data).length;
  const userDataLength = usersData.length;
  const [state, setState] = React.useState({open: false});

  const onStateChange = ({open}) => setState({open});

  const {open} = state;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        {dataLength > 0 && isAdmin && (
          <List.Section
            title={`Total No of users - ${dataLength} `}
            titleStyle={{fontWeight: 'bold'}}>
            {renderUserListItem(data)}
          </List.Section>
        )}
        {userDataLength > 0 && !isAdmin && (
          <List.Section
            title={`Total No of ticktes - ${userDataLength} `}
            titleStyle={{fontWeight: 'bold'}}>
            {renderListItem(usersData)}
          </List.Section>
        )}
        {dataLength === 0 && isAdmin && (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Avatar.Icon
              size={72}
              icon="alert-decagram-outline"
              color="red"
              style={{backgroundColor: 'white'}}
            />
            <Text style={{fontSize: 30}}>No users found</Text>
          </View>
        )}
        {userDataLength === 0 && !isAdmin && (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Avatar.Icon
              size={72}
              icon="alert-decagram-outline"
              color="red"
              style={{backgroundColor: 'white'}}
            />
            <Text style={{fontSize: 30}}>No tickets found</Text>
          </View>
        )}
      </ScrollView>

     
        <TouchableOpacity>
          <Button
            title="Report issue"
            color={colors.green}
            onPress={() => navigation.navigate(ROUTES_NAME.HOME.name)}
          />
        </TouchableOpacity>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  fabStyle: {
    bottom: 16,
    right: 16,
    position: 'absolute',
    backgroundColor: 'green',
  },
});

export default DashboardScreen;
