[![Pocketly](https://pocketly.in/home-page-assets/img/pocketly-logo-with-name.png )](https://pocketly.in)

# React Native Aadhaar SDK

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

React Native Aadhaar SDK is a plug and play react native SDK that can be used to do aadhaar verification for the user.

The user journey is as follows:
  - User enters Aadhaar Number
  - User enters the OTP that is sent to his registered mobile number
  - Magic happens here. You get all the details of the user like his name, address, dob, gender, even his offline-xml KYC file

# Installation
```sh
$ npm install react-native-aadhaar-sdk --save
OR
$ npm install https://github.com/PocketlyIndia/react-native-aadhaar-sdk
```

# Integration / Usage
Your backend server will hit pocketly servers to get a client id
```sh
curl -X POST 'https://partner.pocketly.in/api/get-client-id' --header 'api-key: YOUR_POCKETLY_PARTNER_API_KEY'

{"success":true,"payload":{"clientId":"client-4b97ab17-cc9e-4aaa-a085-393fe5b89e39"}}
```
Give the client id just obtained to the SDK in the frontend
```jsx
import AadharVerificationView from 'react-native-aadhaar-sdk';

render() {
    return (
        <View style={styles.aadhaarVerificationContainerView}>
            <AadharVerificationView
                clientId={'CLIENT_ID_OBTAINED_IN_YOUR_BACKEND'}
                onSuccess={response => alert(response.xml)}
            />
        </View>
    );
}
```

# Response
```json
{
    "aadhaarNumber": "607462814339",
    "fullName": "Harry Potter",
    "careOf": "S/O: Lily Potter",
    "dob": "05-11-1996",
    "emailHash": "81aa7eaa15c5022b11f9bf9d6f...",
    "mobileHash": "d737962d57d5854d6bf27c2608...",
    "gender": "M",
    "address": {
        "careof": "Albus Dumbledore",
        "country": "India",
        "dist": "Surrey",
        "house": "4 Privet Drive",
        "landmark": "Near that school",
        "loc": "Surrey",
        "pc": "654321",
        "po": "Hogwarts",
        "state": "Bengaluru",
        "street": "STREET NO. 33",
        "subdist": "Civil Lines",
        "vtc": "HSR Layout"
    },
    "postalCode": "654321",
    "profileImage": "/9j/4AAQSkZJRgABAgAAAQABAAD/...",
    "hasImage": true,
    "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?><OfflinePaperlessKyc refer...",
    "shareCode": "7194",
    "zipFileBase64": "UEsDBBQACQAIAKi0LFEAAAAAAA..."
}
```

# Demo
![Demo GIF](demo.gif)


**Get in touch with Aarav(9043330401) or Navdeesh(8527250263) for POCKETLY_PARTNER_API_KEY**
