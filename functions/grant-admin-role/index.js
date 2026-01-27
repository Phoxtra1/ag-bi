/**
 * Appwrite Function: Grant Admin Role (Amniva Setup)
 *
 * Grants admin role to ADMIN_EMAIL (configured server-side).
 * Secured with x-admin-grant-secret header.
 *
 * Required env:
 * - APPWRITE_ENDPOINT
 * - APPWRITE_PROJECT_ID
 * - APPWRITE_API_KEY
 * - DATABASE_ID
 * - USER_ROLES_COLLECTION_ID
 * - ADMIN_EMAIL
 * - ADMIN_GRANT_SECRET
 */

import { Client, Databases, Users, Query, ID } from "node-appwrite";

export default async ({ req, res, log, error }) => {
  try {
    const {
      APPWRITE_ENDPOINT,
      APPWRITE_PROJECT_ID,
      APPWRITE_API_KEY,
      DATABASE_ID,
      USER_ROLES_COLLECTION_ID,
      ADMIN_EMAIL,
      ADMIN_GRANT_SECRET
    } = process.env;

    // Fail fast
    const missing = [];
    if (!APPWRITE_ENDPOINT) missing.push("APPWRITE_ENDPOINT");
    if (!APPWRITE_PROJECT_ID) missing.push("APPWRITE_PROJECT_ID");
    if (!APPWRITE_API_KEY) missing.push("APPWRITE_API_KEY");
    if (!DATABASE_ID) missing.push("DATABASE_ID");
    if (!USER_ROLES_COLLECTION_ID) missing.push("USER_ROLES_COLLECTION_ID");
    if (!ADMIN_EMAIL) missing.push("ADMIN_EMAIL");
    if (!ADMIN_GRANT_SECRET) missing.push("ADMIN_GRANT_SECRET");

    if (missing.length) {
      return res.json(
        { ok: false, code: "CONFIG_MISSING", message: "Missing env vars", missing },
        500
      );
    }

    // Secret header guard
    const providedSecret =
      req.headers["x-admin-grant-secret"] ||
      req.headers["X-Admin-Grant-Secret"];

    if (!providedSecret) {
      return res.json(
        { ok: false, code: "UNAUTHORIZED", message: "Missing x-admin-grant-secret header." },
        401
      );
    }

    if (providedSecret !== ADMIN_GRANT_SECRET) {
      return res.json(
        { ok: false, code: "FORBIDDEN", message: "Invalid grant secret." },
        403
      );
    }

    // Init Appwrite
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_API_KEY);

    const users = new Users(client);
    const databases = new Databases(client);

    const email = ADMIN_EMAIL.trim().toLowerCase();

    // Find user by email (safer than equal)
    const usersList = await users.list([
      Query.search("email", email),
      Query.limit(10)
    ]);

    if (!usersList.total || !usersList.users?.length) {
      return res.json(
        {
          ok: false,
          code: "USER_NOT_FOUND",
          message: `No user account found for ${email}. Register first.`,
          hint: "The designated admin must sign up once before role can be assigned."
        },
        404
      );
    }

    const user =
      usersList.users.find((u) => (u.email || "").toLowerCase() === email) ||
      usersList.users[0];

    // Check if already admin
    const existing = await databases.listDocuments(
      DATABASE_ID,
      USER_ROLES_COLLECTION_ID,
      [
        Query.equal("user_id", user.$id),
        Query.equal("role", "admin"),
        Query.limit(1)
      ]
    );

    if (existing.total && existing.documents?.length) {
      return res.json(
        { ok: true, code: "ALREADY_ADMIN", message: "User already has admin role", userId: user.$id, email },
        200
      );
    }

    // Grant admin
    const doc = await databases.createDocument(
      DATABASE_ID,
      USER_ROLES_COLLECTION_ID,
      ID.unique(),
      {
        user_id: user.$id,
        role: "admin",
        granted_at: new Date().toISOString(),
        granted_by: "system"
      }
    );

    return res.json(
      {
        ok: true,
        code: "ADMIN_GRANTED",
        message: "Admin role granted successfully",
        userId: user.$id,
        email,
        documentId: doc.$id
      },
      201
    );
  } catch (e) {
    return res.json(
      { ok: false, code: "SERVER_ERROR", message: "Unexpected error", detail: e?.message || String(e) },
      500
    );
  }
};
