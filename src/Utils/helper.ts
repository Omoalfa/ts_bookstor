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
  'https://www.googleapis.com/auth/user.phonenumbers.read',
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
    personFields: 'emailAddresses,genders,photos,names,phoneNumbers',
  })

  const name = data.names?.find(name => name.metadata.primary);
  const email = data.emailAddresses?.find(email => email.metadata.primary)?.value
  const phoneNumber = data.phoneNumbers?.find(phone => phone.metadata.primary)?.value
  // const photo = data.photos.find(photo => photo.metadata.primary).url
  const gender = data.genders?.find(gender => gender.metadata.primary)?.value

  return {
    first_name: name?.givenName,
    last_name: name?.familyName,
    email,
    phone: phoneNumber,
    // avatar: photo,
    // gender
  }
}

export const pinGenerator = (l: number): string => {
  const value = Math.floor((10 ^ l) + Math.random() * (9 * (10 ^ l)));

  return value.toString();
};

export const passwordLinkGenerator = (otp: string, email: string): string => `${CLIENT_HOST}/auth/forget?pin=${otp}&email=${email}`;

export const diff_minutes = (dt2: Date, dt1: Date): number => {
  let diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}
