import React from 'react';
import { View, Text, TextInput, ActivityIndicator, Button, TouchableOpacity } from 'react-native';

const headers = { 'content-type': 'application/json' };
const getFetchConfig = (bodyJSON) => {
    const method = 'POST';
    const body = JSON.stringify(bodyJSON);
    return { method, body, headers };
};

const COLORS = {
    PINK: '#FF8A91',
    LIGHT_GRAY: '#F6F6F6',
    GREEN: '#4BB543',
}

const BASE_URL = 'https://partner.pocketly.in';
const GENERATE_OTP_URL = `${BASE_URL}/api/aadhaar/sdk/generate-otp`;
const SUBMIT_OTP_URL = `${BASE_URL}/api/aadhaar/sdk/submit-otp`;

const styles = {
    mainView: {
        marginTop: 20,
        marginBottom: 20,
    },
    inputView: {
    },
    label: {
        fontWeight: '500',
        fontSize: 16,
    },
    inputText: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        fontSize: 18,
        fontWeight: '800',
    },
    errorMessageView: {
        margin: 40,
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorMessageText: {
        fontWeight: '600',
        color: COLORS.PINK,
    },
    successMessageView: {
        margin: 40,
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successMessageText: {
        fontWeight: '600',
        color: COLORS.GREEN,
    },
    submitButtonView: {
        backgroundColor: COLORS.PINK,
        alignItems: 'center',
        borderRadius: 6,
        paddingTop: 8,
        paddingBottom: 8,
        marginTop: 16,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
    },
    hintView: {
        backgroundColor: COLORS.LIGHT_GRAY,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 8,
        paddingRight: 8,
        marginTop: 16,
        borderRadius: 4,
    },
    hintText: {

    }
};

export default class AadharVerificationView extends React.Component {

    STEPS = {
        ENTER_AADHAAR_NUMBER: 0,
        ENTER_OTP: 1,
        SUCCESS: 2,
    }

    constructor(props) {
        super(props);
        this.clientId = this.props.clientId;
        this.onSuccess = this.props.onSuccess;
        if(!this.clientId) {
            throw new Error(`AadharVerificationView can only be initialized when a clientId is passed as a prop`);
        }
        if (!this.onSuccess) {
            throw new Error(`AadharVerificationView can only be initialized with a prop named onSuccess`);
        }
        this.state = {
            currentStep: this.STEPS.ENTER_AADHAAR_NUMBER,
            ERROR_MESSAGE: '',
            generateOTPResponse: null,
            aadhaarNumberText: '',
            otpText: '',
            showOnlyLoader: false,
        };
    }

    async parseResponseAndGetPayload(response) {
        const responseText = await response.text();
        let responseJSON;
        try {
            responseJSON = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Error while parsing the response`);
        }
        if (responseJSON.success) {
            return responseJSON.payload;
        } else {
            throw new Error(responseJSON.error);
        }
    }

    handleError(err) {
        if (err && err.message && err.message.length) {
            this.setState({ ERROR_MESSAGE: err.message });
        } else {
            this.setState({ ERROR_MESSAGE: `${err}` });
        }
    }

    aadhaarNumberDidSubmit = () => {
        const { aadhaarNumberText } = this.state;
        const clientId = this.clientId;
        const body = { aadhaarNumber: aadhaarNumberText, clientId };
        try {
            this.setState({ showOnlyLoader: true });
            fetch(GENERATE_OTP_URL, getFetchConfig(body))
                .then(async response => {
                    try {
                        const payload = await this.parseResponseAndGetPayload(response);
                        const { ENTER_OTP } = this.STEPS;
                        this.setState({ showOnlyLoader: false,
                                        generateOTPResponse: payload,
                                        currentStep: ENTER_OTP });
                    } catch (err) {
                        this.handleError(err);
                    }
                });
        } catch (err) {
            this.handleError(err);
        }
    }

    otpDidSubmit = () => {
        const { otpText, generateOTPResponse } = this.state;
        const clientId = this.clientId;
        const { generateOTPReferenceId } = generateOTPResponse;
        const body = { otp: otpText, clientId, generateOTPReferenceId };
        try {
            this.setState({ showOnlyLoader: true });
            fetch(SUBMIT_OTP_URL, getFetchConfig(body))
                .then(async response => {
                    try {
                        const payload = await this.parseResponseAndGetPayload(response);
                        const { SUCCESS } = this.STEPS;
                        this.setState({
                            showOnlyLoader: false,
                            currentStep: SUCCESS
                        });
                        this.onSuccess(payload);
                    } catch (err) {
                        this.handleError(err);
                    }
                });
        } catch (err) {
            this.handleError(err);
        }
    }

    renderAadhaarNumberView() {
        return (
            <View style={styles.mainView}>
                <View style={styles.inputView}>
                    <Text style={styles.label}>Aadhaar Number</Text>
                    <TextInput
                        style={styles.inputText}
                        value={this.state.aadhaarNumberText}
                        onChangeText={(aadhaarNumberText) => this.setState({ aadhaarNumberText })}
                        autoCapitalize={'none'}
                        keyboardType={'number-pad'}
                        autoCorrect={false}
                        placeholder={'12 digit Aadhaar Number'}
                        placeholderTextColor={'#00000018'}
                    />
                </View>
                <View style={styles.hintView}>
                    <Text style={styles.hintText}>ℹ️ OTP will be sent to your Aadhaar linked mobile number</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={this.aadhaarNumberDidSubmit}>
                        <View style={styles.submitButtonView}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderEnterOTPView() {
        return (
            <View style={styles.mainView}>
                <View style={styles.inputView}>
                    <Text style={styles.label}>OTP</Text>
                    <TextInput
                        style={styles.inputText}
                        value={this.state.otpText}
                        onChangeText={(otpText) => this.setState({ otpText })}
                        autoCapitalize={'none'}
                        keyboardType={'number-pad'}
                        autoCorrect={false}
                        placeholder={'Enter OTP'}
                        placeholderTextColor={'#00000018'}
                    />
                </View>
                <View style={styles.hintView}>
                    <Text style={styles.hintText}>✅ OTP has been sent to your Aadhaar linked mobile number</Text>
                </View>
                <View>
                    <TouchableOpacity onPress={this.otpDidSubmit}>
                        <View style={styles.submitButtonView}>
                            <Text style={styles.submitButtonText}>Submit OTP</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    renderErrorMessage() {
        return (
            <View style={styles.errorMessageView}>
                <Text style={styles.errorMessageText}>{this.state.ERROR_MESSAGE}</Text>
            </View>
        );
    }

    renderSuccessView() {
        return (
            <View style={styles.successMessageView}>
                <Text style={styles.successMessageText}>👍🏼 Aadhaar Verification was successful</Text>
            </View>
        );
    }

    renderOnlyLoader() {
        return (
            <View style={{margin: 40, justifyContent: 'center'}}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    render() {
        if (this.state.ERROR_MESSAGE && this.state.ERROR_MESSAGE.length) {
            return this.renderErrorMessage();
        }
        if (this.state.showOnlyLoader) {
            return this.renderOnlyLoader();
        }

        const { ENTER_AADHAAR_NUMBER, ENTER_OTP, SUCCESS } = this.STEPS;
        const { currentStep } = this.state;
        if (currentStep === ENTER_AADHAAR_NUMBER) {
            return this.renderAadhaarNumberView();
        } else if (currentStep === ENTER_OTP) {
            return this.renderEnterOTPView();
        } else { // if (currentStep === SUCCESS) {
            return this.renderSuccessView();
        }

    }
}
