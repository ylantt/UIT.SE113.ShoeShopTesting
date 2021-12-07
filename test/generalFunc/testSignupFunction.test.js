import { Selector, Role, ClientFunction } from 'testcafe';
// import { client, admin } from '../../utilities/createRole';

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const signUpButton = Selector('[data-test = "signUp_button"]');
const signUp_submitBtn = Selector('[data-test="signUp_submitBtn"]');
const signUp_fullname = Selector('[data-test="signUp_fullname"]');
const signUp_username = Selector('[data-test="signUp_username"]');
const signUp_email = Selector('[data-test="signUp_email"]');
const signUp_phone = Selector('[data-test="signUp_phone"]');
const signUp_password = Selector('[data-test="signUp_password"]');
const signUp_confirmpass = Selector('[data-test="signUp_confirmpass"]');
const signUp_errormsg = Selector('[data-test="signUp_errormsg"]');

fixture.only('Test Sign-up function').page(process.env.URL_TEST)

test('SignUp01 - Should redirect to verify page if sign up valid ', async(t) => {
    const getLocation = ClientFunction(() => document.location.href);
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, 'huongtranngoc')
    .typeText(signUp_email, '18520815@gm.uit.edu.vn')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(getLocation()).contains(`${process.env.URL_TEST}verify`);

});

test('SignUp02 - should display Passwords do not match', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, 'huongtranngoc')
    .typeText(signUp_email, '18520815@gm.uit.edu.vn')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '12345678')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Passwords do not match')

});

test('SignUp03 - should display Passwords should be at least 8 characters', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, 'huongtranngoc')
    .typeText(signUp_email, '18520815@gm.uit.edu.vn')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, '@123')
    .typeText(signUp_confirmpass, '@123')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Passwords should be at least 8 characters')

});
test('SignUp04 - should display Please fill in all fields', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, ' ')
    .typeText(signUp_username, ' ')
    .typeText(signUp_email, ' ')
    .typeText(signUp_phone, ' ')
    .typeText(signUp_password, ' ')
    .typeText(signUp_confirmpass, ' ')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Please fill in all fields')

});

test('SignUp05 - should display Duplicate email or username, please try again', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, 'dungph')
    .typeText(signUp_email, 'dunghocgioi@gmail.com')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Duplicate email or username, please try again')

});

test('SignUp06 - should display Duplicate email or username, please try again', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, '@hiennguyen')
    .typeText(signUp_email, 'dunghocgioi@gmail.com')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Duplicate email or username, please try again')

});

test('SignUp07 - should display Please fill in all fields', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, ' ')
    .typeText(signUp_username, '@hiennguyen')
    .typeText(signUp_email, '18520815@gm.uit.edu.vn')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Please fill in all fields')

});
test('SignUp08 - should display Please fill in all fields', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, ' ')
    .typeText(signUp_email, '18520815@gm.uit.edu.vn')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Please fill in all fields')

});
test('SignUp09 - should display Please fill in all fields', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, '@hiennguyen')
    .typeText(signUp_email, ' ')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Please fill in all fields')

});
test('SignUp10 - should display Please fill in all fields', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, '@hiennguyen')
    .typeText(signUp_email, '18520815@gm.uit.edu.vn')
    .typeText(signUp_phone, ' ')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Please fill in all fields')

});
test('SignUp11 - should display Please fill in all fields', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, '@hiennguyen')
    .typeText(signUp_email, '18520815@gm.uit.edu.vn')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, ' ')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Please fill in all fields')

});
test('SignUp12 - should display Please fill in all fields', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, '@hiennguyen')
    .typeText(signUp_email, '18520815@gm.uit.edu.vn')
    .typeText(signUp_phone, '1234')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, ' ')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Please fill in all fields')

});
test('SignUp13 - Should redirect to verify page if sign up valid ', async(t) => {
    const getLocation = ClientFunction(() => document.location.href);
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, '@hiennguyen')
    .typeText(signUp_email, '18520815@gm.uit.edu.vn')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(getLocation()).contains(`${process.env.URL_TEST}verify`);

});
test('Auth25 - Should redirect to verify page if sign up valid ', async(t) => {
    const getLocation = ClientFunction(() => document.location.href);
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Huong Tran')
    .typeText(signUp_username, 'tnhuong')
    .typeText(signUp_email, 'huongtn220120@gmail.com')
    .typeText(signUp_phone, '0923456978')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(getLocation()).contains(`${process.env.URL_TEST}verify`);

});

test('Auth26 - should display Please fill in all fields', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, ' ')
    .typeText(signUp_username, 'tnhuong')
    .typeText(signUp_email, 'huongtn220120@gmail.com')
    .typeText(signUp_phone, '0923456978')
    .typeText(signUp_password, '123456789')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Please fill in all fields')

});
test('Auth27 - should display Passwords do not match', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Huong Tran')
    .typeText(signUp_username, 'tnhuong')
    .typeText(signUp_email, 'huongtn220120@gmail.com')
    .typeText(signUp_phone, '0923456978')
    .typeText(signUp_password, '12345678')
    .typeText(signUp_confirmpass, '123456789')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Passwords should be at least 8 characters')

});
test('Auth28 - should display Passwords should be at least 8 characters', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Huong Tran')
    .typeText(signUp_username, 'tnhuong')
    .typeText(signUp_email, 'huongtn220120@gmail.com')
    .typeText(signUp_phone, '0923456978')
    .typeText(signUp_password, '12345')
    .typeText(signUp_confirmpass, '12345')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Passwords should be at least 8 characters')

});
test('Auth29 - should display Duplicate email or username, please try again', async(t) => {
    await t
    .click(signUpButton)
    .typeText(signUp_fullname, 'Hiền Nguyễn')
    .typeText(signUp_username, '@hiennguyen')
    .typeText(signUp_email, 'dunghocgioi@gmail.com')
    .typeText(signUp_phone, '0333196549')
    .typeText(signUp_password, '12345678')
    .typeText(signUp_confirmpass, '12345678')    
    .click(signUp_submitBtn)
    .expect(signUp_errormsg.innerText).eql('Passwords do not match')

});