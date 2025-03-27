// utils/user.ts
import Parse from 'parse';

export const signUp = async (username: string, email: string, password: string) => {
  const user = new Parse.User();
  user.set('username', username);
  user.set('email', email);
  user.set('password', password);

  try {
    await user.signUp();
    return user;
  } catch (error) {
    throw error;
  }
};

export const logIn = async (username: string, password: string) => {
  try {
    const user = await Parse.User.logIn(username, password);
    return user;
  } catch (error) {
    throw error;
  }
};

export const logOut = async () => {
  try {
    await Parse.User.logOut();
  } catch (error) {
    throw error;
  }
};
