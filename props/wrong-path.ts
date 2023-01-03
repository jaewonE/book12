import { IWrongPath } from '../components/wrong-path';

export const requireLogIn: IWrongPath = {
  maintitle: 'Please Log in',
  subtitle: 'You need to login to setup your profile',
  linkName: 'Go to main page',
  linkHref: '/',
  message: {
    message: "Don't have an account? ",
    linkName: 'Sign up',
    linkHref: '/signup',
  },
};

export const alreaySignIn: IWrongPath = {
  maintitle: 'Already Log in',
  subtitle: 'You are already logged in',
  linkName: 'Go to main page',
};
