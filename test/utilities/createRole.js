import { Role } from 'testcafe';

export const client = Role(`http://127.0.0.1:8000/signIn`, async t => {
    await t
        .typeText('[data-test="signIn_username"]', 'dungph')
        .typeText('[data-test="signIn_pass"]', '123456789')
        .click('[data-test="signIn_submitBtn"]');
});

export const admin = Role(`http://127.0.0.1:8000/signIn`, async t => {
    await t
        .typeText('[data-test="signIn_username"]', 'ylantt')
        .typeText('[data-test="signIn_pass"]', '12345678')
        .click('[data-test="signIn_submitBtn"]');
});

