import { databases, account, DATABASE_ID } from '@/lib/database';
import { ID, Query } from 'appwrite';
import { ENGINE_COLLECTIONS, EngineType } from '@/lib/appwriteEngines';

export type EngineMode = 'internal' | 'external' | 'merge';

export interface EngineExternalConfig {
  $id?: string;
  engineType: EngineType;
  enabled: boolean;
  mode: EngineMode;
  confidence_threshold: number;
  external_api_url?: string;
  external_api_key?: string;
  last_updated: string;
  updated_by: string;
}

async function getCurrentUserId(): Promise<string> {
  try {
    const user = await account.get();
    return user.$id;
  } catch {
    return 'anonymous';
  }
}

export async function fetchEngineConfig(engineType: EngineType): Promise<EngineExternalConfig | null> {
  const res = await databases.listDocuments(
    DATABASE_ID,
    ENGINE_COLLECTIONS.TOGGLES,
    [Query.equal('engineType', engineType), Query.limit(1)]
  );
  const doc = res.documents[0] as unknown as EngineExternalConfig | undefined;
  return doc ?? null;
}

export async function upsertEngineConfig(engineType: EngineType, data: Partial<EngineExternalConfig>): Promise<EngineExternalConfig> {
  const existing = await fetchEngineConfig(engineType);
  const now = new Date().toISOString();
  const updated_by = await getCurrentUserId();

  const payload: Partial<EngineExternalConfig> = {
    engineType,
    last_updated: now,
    updated_by,
    ...data,
  } as Partial<EngineExternalConfig>;

  if (existing && existing.$id) {
    const updated = await databases.updateDocument(
      DATABASE_ID,
      ENGINE_COLLECTIONS.TOGGLES,
      existing.$id,
      payload
    );
    return updated as unknown as EngineExternalConfig;
  }

  // Defaults for new config
  const defaultPayload: EngineExternalConfig = {
    engineType,
    enabled: false,
    mode: 'internal',
    confidence_threshold: 0.7,
    external_api_url: '',
    external_api_key: '',
    last_updated: now,
    updated_by,
  };

  const created = await databases.createDocument(
    DATABASE_ID,
    ENGINE_COLLECTIONS.TOGGLES,
    ID.unique(),
    { ...defaultPayload, ...payload }
  );
  return created as unknown as EngineExternalConfig;
}

export async function saveMultipleEngineConfigs(configs: Array<{ engineType: EngineType; data: Partial<EngineExternalConfig> }>) {
  return Promise.all(configs.map(c => upsertEngineConfig(c.engineType, c.data)));
}
