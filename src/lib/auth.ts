// auth.ts

import { Client, Account, ID } from 'appwrite';

// Appwrite config
const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1') // API endpoint
  .setProject('amniva-ri03'); // Project ID

const account = new Account(client);

// REGISTER user
export const registerUser = async (email: string, password: string, name: string) => {
  try {
    const response = await account.create(ID.unique(), email, password, name);
    return response;
  } catch (error) {
    throw error;
  }
};

// LOGIN user
export const loginUser = async (email: string, password: string) => {
  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw error;
  }
};

// GET current session/user
export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    throw error;
  }
};

// LOGOUT user
export const logoutUser = async () => {
  try {
    await account.deleteSession('current');
    return true;
  } catch (error) {
    throw error;
  }
};
