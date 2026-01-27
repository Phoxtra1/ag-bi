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

function getHeader(headers, key) {
  if (!headers) return undefined;
  const lower = key.toLowerCase();
  // Appwrite headers can arrive as an object; normalize
  for (const k of Object.keys(headers)) {
    if (k.toLowerCase() === lower) return headers[k];
  }
  return undefined;
}

function parseJsonBody(req) {
  // Appwrite often provides req.bodyJson; fallback to req.body (string)
  if (req && req.bodyJson && typeof req.bodyJson === "object") return req.bodyJson;

  const raw = (req && typeof req.body === "string") ? req.body : "";
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return { __badJson: true };
  }
}

export default async ({ req, res, log, error }) => {
  try {
    const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT;
    const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
    const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;

    const DATABASE_ID = process.env.DATABASE_ID;
    const USER_ROLES_COLLECTION_ID = process.env.USER_ROLES_COLLECTION_ID;

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_GRANT_SECRET = process.env.ADMIN_GRANT_SECRET;

    // Fail fast: env validation
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

    // Secret header guard (case-insensitive)
    const providedSecret = getHeader(req.headers, "x-admin-grant-secret");
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

    // Parse request body (optional) — allows override email if you later want it
    const body = parseJsonBody(req);
    if (body.__badJson) {
      return res.json(
        { ok: false, code: "BAD_JSON", message: "Request body must be valid JSON." },
        400
      );
    }

    // For now, we use server configured email; body.email can be used later if you decide
    const email = String(ADMIN_EMAIL).trim().toLowerCase();
    if (!email) {
      return res.json(
        { ok: false, code: "VALIDATION_ERROR", message: "ADMIN_EMAIL is empty." },
        400
      );
    }

    // Init Appwrite server client
    const client = new Client()
      .setEndpoint(APPWRITE_ENDPOINT)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(APPWRITE_API_KEY);

    const users = new Users(client);
    const databases = new Databases(client);

    log?.(`[grant-admin-role] Searching user by email: ${email}`);

    // Find user by email (search is more tolerant than equal)
    const usersList = await users.list([Query.search("email", email), Query.limit(10)]);

    const listTotal = usersList?.total ?? 0;
    const listUsers = usersList?.users ?? [];

    if (!listTotal || !listUsers.length) {
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
      listUsers.find((u) => String(u.email || "").toLowerCase() === email) ||
      listUsers[0];

    if (!user || !user.$id) {
      return res.json(
        { ok: false, code: "USER_LOOKUP_FAILED", message: "User lookup returned no usable user record." },
        500
      );
    }

    // Check if already admin
    const existing = await databases.listDocuments(
      DATABASE_ID,
      USER_ROLES_COLLECTION_ID,
      [Query.equal("user_id", user.$id), Query.equal("role", "admin"), Query.limit(1)]
    );

    const existingTotal = existing?.total ?? 0;
    const existingDocs = existing?.documents ?? [];

    if (existingTotal && existingDocs.length) {
      return res.json(
        {
          ok: true,
          code: "ALREADY_ADMIN",
          message: "User already has admin role",
          userId: user.$id,
          email
        },
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
        documentId: doc?.$id
      },
      201
    );
  } catch (e) {
    error?.(`[grant-admin-role] ${e?.message || e}`);
    return res.json(
      {
        ok: false,
        code: "SERVER_ERROR",
        message: "Unexpected error",
        detail: e?.message || String(e)
      },
      500
    );
  }
};
