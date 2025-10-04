export const registerUser = async (credentials: RegisterCredentials) => {
  try {
    // Always clear any existing session first to avoid 409 conflicts
    try { 
      await account.deleteSession('current'); 
    } catch {}

    // Create the user
    const user = await account.create(
      ID.unique(),
      credentials.email,
      credentials.password,
      credentials.name
    );

    // Give Appwrite a moment to finalize user creation before login
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Auto-login after successful registration
    const session = await account.createEmailPasswordSession(
      credentials.email,
      credentials.password
    );

    return {
      success: true,
      data: { user, session },
      status: 201
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    const message: string = error?.message || 'Registration failed';
    const code: number | undefined = error?.code;

    // If user already exists, try logging them in
    if (code === 409 || /already exists/i.test(message)) {
      try {
        // Clean up any stale sessions before login
        try { await account.deleteSession('current'); } catch {}
        const session = await account.createEmailPasswordSession(
          credentials.email,
          credentials.password
        );
        return { success: true, data: { session }, status: 200 };
      } catch (loginError: any) {
        console.error('Auto-login after duplicate user failed:', loginError);
        return { 
          success: false, 
          data: { error: 'Email already registered. Please log in with your password.' }, 
          status: 400 
        };
      }
    }

    // Generic error response
    return {
      success: false,
      data: { error: message },
      status: 400
    };
  }
};
