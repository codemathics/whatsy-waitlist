import { Client } from "@notionhq/client";

type WaitlistEntry = {
  name: string;
  email: string;
  useCase: string;
  source?: string;
};

let notionClient: Client | null = null;

function getNotionClient(): Client {
  if (notionClient) return notionClient;

  const auth = process.env.NOTION_API_KEY;
  if (!auth) {
    throw new Error("NOTION_API_KEY is not configured.");
  }

  notionClient = new Client({ auth });
  return notionClient;
}

function getWaitlistDatabaseId(): string {
  const databaseId = process.env.NOTION_WAITLIST_DATABASE_ID;
  if (!databaseId) {
    throw new Error("NOTION_WAITLIST_DATABASE_ID is not configured.");
  }
  return databaseId;
}

export async function waitlistEntryExists(email: string): Promise<boolean> {
  const notion = getNotionClient();
  const database_id = getWaitlistDatabaseId();

  const response = await notion.databases.query({
    database_id,
    filter: {
      property: "Email",
      email: {
        equals: email,
      },
    },
    page_size: 1,
  });

  return response.results.length > 0;
}

export async function createWaitlistEntry({
  name,
  email,
  useCase,
  source = "website",
}: WaitlistEntry): Promise<void> {
  const notion = getNotionClient();
  const database_id = getWaitlistDatabaseId();

  await notion.pages.create({
    parent: { database_id },
    properties: {
      Name: {
        title: [{ text: { content: name } }],
      },
      Email: {
        email,
      },
      "Use Case": {
        rich_text: [{ text: { content: useCase } }],
      },
      Source: {
        rich_text: [{ text: { content: source } }],
      },
      "Submitted At": {
        date: { start: new Date().toISOString().split("T")[0] },
      },
    },
  });
}
