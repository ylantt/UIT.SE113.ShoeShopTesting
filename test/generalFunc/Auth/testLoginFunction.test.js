import { Selector, Role, ClientFunction } from 'testcafe';
import { client, admin } from '../../utilities/createRole';

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const signInButton = Selector('[data-test = "signIn_button"]');

fixture('Test login function').page(process.env.URL_TEST)

test('Auth-4 - should redirect to home page if logged in with client account', async(t) => {
    const getLocation = ClientFunction(() => document.location.href);
    
    await t
    .useRole(client)
    .expect(getLocation()).contains(process.env.URL_TEST);
});

test('Auth-5 - should redirect to admin dashboard page if logged in with admin account', async(t) =>{
    const getLocation = ClientFunction(() => document.location.href);
    await t
    .click(signInButton)
    .typeText('[data-test="signIn_username"]', 'ylantt')
    .typeText('[data-test="signIn_pass"]', '12345678')
    .click('[data-test="signIn_submitBtn"]')
    .expect(getLocation()).contains(`${process.env.URL_TEST}/admin`);
});

test('Auth-6 - should return error message with inputs: right username and wrong password', async(t) =>{
    
    await t
    .click(signInButton)
    .typeText('[data-test="signIn_username"]', 'ylantt')
    .typeText('[data-test="signIn_pass"]', '123456')
    .click('[data-test="signIn_submitBtn"]')
    .expect('[data-test = "errormsg"]').notEql('');
});

test('Auth-7 - should return error message with inputs: wrong username and right password', async(t) =>{
    
    await t
    .click(signInButton)
    .typeText('[data-test="signIn_username"]', 'abcdef')
    .typeText('[data-test="signIn_pass"]', '12345678')
    .click('[data-test="signIn_submitBtn"]')
    .expect('[data-test = "errormsg"]').notEql('');
});

test('Auth-8 - should return error message with inputs: no username and right password', async(t) =>{
    
    await t
    .click(signInButton)
    .typeText('[data-test="signIn_pass"]', '12345678')
    .click('[data-test="signIn_submitBtn"]')
    .expect('[data-test = "errormsg"]').notEql('');
});