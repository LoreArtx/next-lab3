import type { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import { createPool } from '@vercel/postgres';

import dotenv from 'dotenv';
dotenv.config();


async function addUserIfNotExists(email: string, name: string) {
  const connectionString = process.env.POSTGRES_URL as string;
  const client = createPool({ connectionString });

  try {
    const user = await client.sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (user.rowCount === 0) {
      await client.sql`
        INSERT INTO users (name, email)
        VALUES (${name}, ${email})
        ON CONFLICT (email) DO NOTHING;
      `;
      console.log(`Added new user: ${name}`);
    }
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  } finally {
    await client.end();
  }
}



export const options : NextAuthOptions = {
  providers: [
    GithubProvider({
    clientId: process.env.GITHUB_ID as string,
    clientSecret: process.env.GITHUB_SECRET as string
  }),  
    GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
  })
  ],
  
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks:{
    async signIn({ user, account, profile }) {
      const email = user.email as string;
      const name = user.name as string;
      console.log(123)
      await addUserIfNotExists(email, name);
      return true;
    },
  },
}