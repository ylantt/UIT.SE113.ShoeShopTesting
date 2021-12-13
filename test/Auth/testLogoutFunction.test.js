import { Selector, Role, ClientFunction } from 'testcafe';
import { client, admin } from '../utilities/createRole';

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const navbarUsername = Selector('[data-test="navbar_userName"]');
const signInButton = Selector('[data-test = "signIn_button"]');
const logOutURL = Selector('[data-test = "logOutURL"]');

fixture('Check logout function').page(process.env.URL_TEST)

test('Auth-10 - Process logout function and check whether the username still exsists on navbar or not', async (t) => {
    await t
      .useRole(Role.anonymous())
      .expect(navbarUsername.visible).notOk()
  });

test('Auth-11 - Process login function and confirm there is "Log out" button when clicking on username on navbar', async(t) => {
  await t
    .useRole(client)
    .click(navbarUsername)
    .expect(logOutURL.visible).ok()
});

