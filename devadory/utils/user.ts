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

export const logIn = async (email: string, password: string) => {
    try {
        await Parse.User.logIn(email, password);
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
