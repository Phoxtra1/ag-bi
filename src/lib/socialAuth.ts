import { supabase } from "@/lib/supabase";

const signInWithProvider = async (provider: "facebook" | "github" | "azure") => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/login?oauth=1` },
  });
  return error ? { success: false, error: error.message } : { success: true };
};

export const loginWithFacebook = () => signInWithProvider("facebook");
export const loginWithGithub = () => signInWithProvider("github");
export const loginWithMicrosoft = () => signInWithProvider("azure");

export const checkOAuthSession = async () => {
  const { data, error } = await supabase.auth.getUser();
  return error ? { success: false, user: null } : { success: true, user: data.user };
};
