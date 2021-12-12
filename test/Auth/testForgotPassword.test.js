import { Selector, Role, ClientFunction } from 'testcafe';
import { sendOTP } from '../../controllers/backendClientController';
import { client, admin } from '../utilities/createRole';

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const signInButton = Selector('[data-test = "signIn_button"]');
const forgotpassURL = Selector('[data-test = "ForgotPassURL"]');
const searchAccButton = Selector('[data-test="search-Btn"]');
const validateBtn = Selector('[data-test="validateBtn"]');
const otpMSG =Selector('[data-test="otpMSG"]');

fixture('Check logout function').page(process.env.URL_TEST)

test('Auth-12 - Check if "Forgot Password" link is visible in login page', async(t) => {
    await t
    .click(signInButton)
    .expect(forgotpassURL.visible).ok
})

test('Auth-13 - Verify if the forgot password link is landed on the right page', async(t) => {
    const getLocation = ClientFunction(() => document.location.href);

    await t
    .click(signInButton)
    .click(forgotpassURL)
    .expect(getLocation()).contains(`${process.env.URL_TEST}/forgotPassword`)
})

test('Auth-14 - Verify after click "Search" button with valid email, proceed to "Enter OTP" page', async(t) => {
    const getLocation = ClientFunction(() => document.location.href);
    await t
    .click(signInButton)
    .click(forgotpassURL)
    .typeText('[data-test = "forgotPassField"]', 'hoangdungphan2609@gmail.com')
    .click(searchAccButton)
    .expect(getLocation()).contains(`${process.env.URL_TEST}/validate`)
})

test('Auth-15 - Verify if the input email does not exist, after clicking Search button, display an error of (Incorrect username/email)', async(t) => {
    await t
    .click(signInButton)
    .click(forgotpassURL)
    .typeText('[data-test = "forgotPassField"]', 'dunghocgioi@gmail.com')
    .click(searchAccButton)
    .expect('[data-test = "errormsg"]').notEql('');
})

test('Auth-16 - Verify after click "Search" button with valid username, proceed to "Enter OTP" page', async(t) => {
    const getLocation = ClientFunction(() => document.location.href);
    await t
    .click(signInButton)
    .click(forgotpassURL)
    .typeText('[data-test = "forgotPassField"]', 'dungph')
    .click(searchAccButton)
    .expect(getLocation()).contains(`${process.env.URL_TEST}/validate`)
})

test('Auth-17 - Verify if the input username does not exist, after clicking Search button, display an error of (Incorrect username/email)', async(t) => {
    await t
    .click(signInButton)
    .click(forgotpassURL)
    .typeText('[data-test = "forgotPassField"]', 'abcd')
    .click(searchAccButton)
    .expect('[data-test = "errormsg"]').notEql('');
})

test('Auth-22 - Verify that the system does not accept old OTP after the new one was sent', async(t) => {
    await t
    .click(signInButton)
    .click(forgotpassURL)
    .typeText('[data-test = "forgotPassField"]', 'dungph')
    .click(searchAccButton)
    .typeText('[data-test="otpField"]', '613113')
    .click(validateBtn)
    .expect('[data-test = "otpMSG"]').notEql('');
})
