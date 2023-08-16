import { CLIENT_HOST, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URL } from "@/Config";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  CLIENT_HOST + GOOGLE_REDIRECT_URL
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/profile.emails.read',
  'https://www.googleapis.com/auth/user.gender.read',
  'https://www.googleapis.com/auth/userinfo.profile'
];

export const generateAuthUrl = (): string => {
  const url = oauth2Client.generateAuthUrl({
    scope: scopes
  });

  return url;
}

export const validateCode = async (code: string): Promise<boolean> => {
  const { tokens } = await oauth2Client.getToken(code);

  return !!tokens;
}

export const getUserProfile = async (code: string) => {
  const { tokens } = await oauth2Client.getToken(code);
  
  const { data } = await google.people('v1').people.get({
    resourceName: 'people/me',
    access_token: tokens.access_token,
    personFields: 'emailAddresses,genders,names',
  })

  const name = data.names?.find(name => name.metadata.primary);
  const email = data.emailAddresses?.find(email => email.metadata.primary)?.value
  const gender = data.genders?.find(gender => gender.metadata.primary)?.value

  return {
    name: name.displayName,
    email,
    gender,
  }
}

export const pinGenerator = (l: number): string => {
  const p = l - 1;
  const value = Math.floor(Math.pow(10, p) + Math.random() * (9 * Math.pow(10, p)));

  return value.toString();
};

export const passwordLinkGenerator = (otp: string, email: string): string => `${CLIENT_HOST}/auth/forget?pin=${otp}&email=${email}`;

export const diff_minutes = (dt2: Date, dt1: Date): number => {
  let diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
