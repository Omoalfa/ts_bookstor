
export enum ETables {
  USER = 'users',
  BOOK = 'books',
  AUTHOR = 'authors'
}

export interface IUser {
  id?: number;
  email: string;
  password?: string;
  verification_code?: string
  is_verified?: string
  password_otp?: string;
  created_at?: Date;
  deleted_at?: Date;
  updated_at?: Date;
}

export interface IBook {
  id?: number;
  title: string;
  description?: string;
  author_id?: number
  author?: IAuthor
  publish_date?: Date;
  created_at?: Date;
  deleted_at?: Date;
  updated_at?: Date;
}

export enum ETitle {
  MR = "Mr.",
  MRS = "Mrs.",
  DR = "Dr.",
  PROF = "Prof.",
  MISS = "Miss"
}

export enum EGender {
  MALE = "male",
  FEMALE = "female"
}

export interface IAuthor {
  id?: number;
  title: ETitle;
  name?: string;
  email?: string
  created_at?: Date;
  deleted_at?: Date;
  updated_at?: Date;
}
