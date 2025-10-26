declare namespace App {
  interface SessionData {
    user: {
      id: string;
      username: string;
      avatar: string;
      guilds?: Array<{
        id: string;
        name: string;
        permissions: number;
        // Other guild fields
      }>; // Optional: fetched dynamically if needed
      accessToken?: string; // Optional
    } | null;
  }
}