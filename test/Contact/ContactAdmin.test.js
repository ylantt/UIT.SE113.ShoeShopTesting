import { Selector, ClientFunction } from 'testcafe';
import { admin } from '../utilities/createRole';

// import environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const user_name = Selector('[data-test="user_name"]');
const user_email = Selector('[data-test="user_email"]');
const user_message = Selector('[data-test="user_message"]');
const btnSend = Selector('[data-test="send_message"]');

fixture('Contact')
    .page(`${process.env.URL_TEST}\contact`)

test('Contact1', async t =>{
        const getLocation = ClientFunction(() => document.location.href)
        
        await t
        .setNativeDialogHandler(() => true)
        .typeText(user_name,'a')
        .typeText(user_email, 'a@gmail.com')
        .typeText(user_message,'Lop hoc kiem chung phan mem')
        .click(btnSend)
        .expect(getLocation()).contains(`${process.env.URL_TEST}\contact`);
    })