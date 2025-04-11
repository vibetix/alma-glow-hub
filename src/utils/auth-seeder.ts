
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
    // First, check if user exists by attempting to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!authError && authData?.user) {
      console.log(`User with email ${email} already exists with ID: ${authData.user.id}`);
      
      // Make sure the user is signed out afterwards
      await supabase.auth.signOut();
      
      try {
        // Update the profile directly with a more reliable method
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
          if (updateError.code === '42P17') {
            return {
              success: false,
              message: `User exists but there's a permission issue updating the profile. Try logging in directly.`
            };
          }
          throw updateError;
        }
        
        return {
          success: true,
          message: `User with email ${email} already exists and has been updated to role: ${role}`
        };
      } catch (error: any) {
        console.error("Error in profile update:", error);
        // If we can't update, at least let them know the user exists
        return {
          success: true,
          message: `User with email ${email} already exists but couldn't update profile: ${error.message}`
        };
      }
    }
    
    // If user doesn't exist, create a new user
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
      // Insert new profile with a direct insert that bypasses RLS
      const { data: profileData, error: profileError } = await supabase.rpc(
        'create_or_update_profile',
        { 
          user_id: signUpData.user.id,
          user_role: role,
          first_name_val: firstName,
          last_name_val: lastName
        }
      );
      
      if (profileError) {
        console.error("Error calling create_or_update_profile function:", profileError);
        throw profileError;
      }
      
      console.log("Profile created or updated through RPC function:", profileData);
    } catch (error: any) {
      console.error('Error creating/updating profile through RPC:', error);
      return {
        success: false,
        message: `User created but profile setup failed: ${error.message}`
      };
    }

    return {
      success: true,
      message: `Successfully created ${role} user with email ${email}`
    };
  } catch (error: any) {
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
      email: 'info@almabeautyspa.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin' as const
    },
    {
      email: 'staff@almabeautyspa.com',
      password: 'password123',
      firstName: 'Staff',
      lastName: 'Member',
      role: 'staff' as const
    },
    {
      email: 'user@almabeautyspa.com',
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
    'info@almabeautyspa.com',
    'password123',
    'Admin',
    'User',
    'admin'
  );
  
  return result;
};
