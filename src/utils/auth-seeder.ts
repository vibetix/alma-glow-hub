
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Creates a test user with the specified role
 * @param email Email address for the test user
 * @param password Password for the test user
 * @param firstName First name for the test user
 * @param lastName Last name for the test user
 * @param role Role to assign to the user ('admin', 'staff', or 'user')
 * @returns Promise with success status and message
 */
export const createTestUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role: 'admin' | 'staff' | 'user'
): Promise<{ success: boolean; message: string }> => {
  try {
    // First check if a user with this email already exists
    const { data: existingUsers, error: existingError } = await supabase.auth.admin.listUsers({
      filters: {
        email: email
      }
    });
    
    if (existingError) {
      console.log("Error checking existing users:", existingError);
      // Proceed with normal flow if we can't check existing users
    } else if (existingUsers && existingUsers.users.length > 0) {
      // User exists in auth, now check if profile exists
      const existingUser = existingUsers.users[0];
      console.log(`User with email ${email} already exists with ID: ${existingUser.id}`);
      
      // Check if profile exists
      const { data: profileData, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', existingUser.id)
        .single();
      
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        // Real error, not just "no rows returned"
        console.error("Error checking profile:", profileCheckError);
        throw profileCheckError;
      }
      
      if (profileData) {
        // Profile exists, update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role,
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);
        
        if (updateError) {
          console.error("Error updating profile:", updateError);
          throw updateError;
        }
        
        return {
          success: true,
          message: `User ${email} already exists and has been updated to role: ${role}`
        };
      } else {
        // User exists but profile doesn't, create profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            id: existingUser.id,
            role,
            first_name: firstName,
            last_name: lastName
          });
        
        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }
        
        return {
          success: true,
          message: `User ${email} already exists and profile has been created with role: ${role}`
        };
      }
    }
    
    // Attempt to sign in with the credentials to see if user exists
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!authError && authData?.user) {
      console.log(`User with email ${email} already exists with ID: ${authData.user.id}`);
      
      // Check if profile exists
      const { data: profileData, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        // Real error, not just "no rows returned"
        console.error("Error checking profile:", profileCheckError);
        throw profileCheckError;
      }
      
      // Update or create profile
      if (profileData) {
        // Profile exists, update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role,
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString()
          })
          .eq('id', authData.user.id);
        
        if (updateError) {
          console.error("Error updating profile:", updateError);
          throw updateError;
        }
      } else {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            id: authData.user.id,
            role,
            first_name: firstName,
            last_name: lastName
          });
        
        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }
      }
      
      // Sign out after checking
      await supabase.auth.signOut();
      
      return {
        success: true,
        message: `User with email ${email} already exists and has been updated to role: ${role}`
      };
    }
    
    // Create new user with Supabase auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (signUpError) {
      throw signUpError;
    }

    if (!signUpData.user) {
      return {
        success: false,
        message: 'Failed to create user'
      };
    }

    console.log(`Created new user with ID: ${signUpData.user.id}`);
    
    // Wait a moment to ensure auth data is processed
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Insert new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ 
          id: signUpData.user.id,
          role,
          first_name: firstName,
          last_name: lastName
        });

      if (insertError) {
        console.error("Error inserting profile:", insertError);
        throw insertError;
      }
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        console.log("Profile already exists, updating instead");
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role,
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString()
          })
          .eq('id', signUpData.user.id);

        if (updateError) {
          console.error("Error updating profile:", updateError);
          throw updateError;
        }
      } else {
        throw error;
      }
    }

    return {
      success: true,
      message: `Successfully created ${role} user with email ${email}`
    };
  } catch (error) {
    console.error('Error creating test user:', error);
    return {
      success: false,
      message: error.message || 'An unknown error occurred'
    };
  }
};

/**
 * Creates test users for all roles
 */
export const createAllTestUsers = async () => {
  const users = [
    {
      email: 'admin@almabeauty.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin' as const
    },
    {
      email: 'staff@almabeauty.com',
      password: 'password123',
      firstName: 'Staff',
      lastName: 'Member',
      role: 'staff' as const
    },
    {
      email: 'user@almabeauty.com',
      password: 'password123',
      firstName: 'Regular',
      lastName: 'User',
      role: 'user' as const
    }
  ];

  for (const user of users) {
    const result = await createTestUser(
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.role
    );
    
    toast({
      title: result.success ? 'User Created' : 'Creation Failed',
      description: result.message,
      variant: result.success ? 'default' : 'destructive'
    });
  }
};

/**
 * Creates just an admin user - useful for initial setup
 */
export const createAdminUser = async () => {
  const result = await createTestUser(
    'admin@almabeauty.com',
    'password123',
    'Admin',
    'User',
    'admin'
  );
  
  return result;
};
