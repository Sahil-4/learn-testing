// @ts-check
import { expect, test } from "@playwright/test";

const sleepFor = async (/** @type {number} */ seconds) => {
  await new Promise((resolve) => setTimeout(() => resolve(""), seconds * 1000));
};

test("test:: complete test", async ({ page }) => {
  // go to page in browser (incognito mode)
  await page.goto("http://localhost:5173");
  // check page title
  expect(page).toHaveTitle("Access and Refresh Token demo app");
  await sleepFor(1); // just to wait for a seconds

  // input username and password
  await page.getByPlaceholder("username").fill("username");
  await page.getByPlaceholder("password").fill("password");
  await sleepFor(1);
  // click on login button to login
  await page.getByLabel("button-login").click();
  // await page.getByText("Login").click();
  await sleepFor(1);

  // check notes container
  await expect(page.getByLabel("notes_container")).toBeInViewport();
  await sleepFor(1);

  // count notes items
  let elements = await page.getByLabel("note_item").all();
  expect(elements.length).toBe(0);
  await sleepFor(1);

  // add new note
  await page.getByLabel("input-new_note").fill("TEST :: new note 1");
  await page.getByLabel("button-add_note").click();
  await sleepFor(1);
  await page.getByLabel("input-new_note").fill("TEST :: new note 2");
  await page.getByLabel("button-add_note").click();
  await sleepFor(1);

  // count notes
  elements = await page.getByLabel("note_item").all();
  expect(elements.length).toBe(2);
  await sleepFor(1);

  // delete a note
  const btns = await page.getByLabel("button-delete_note").all();
  btns[1].click();
  await sleepFor(1);
  btns[0].click();
  await sleepFor(1);
});
