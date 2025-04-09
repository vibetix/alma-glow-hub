
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
    // Check if user already exists by checking auth.users via the profile id
    // We can't query by email directly since email isn't in the profiles table
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (!authError && authData?.user) {
      console.log(`User with email ${email} already exists with ID: ${authData.user.id}`);
      
      // Update the user's role in the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          role,
          first_name: firstName,
          last_name: lastName,
          updated_at: new Date().toISOString()
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        throw profileError;
      }
      
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

    // Check if the profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signUpData.user.id)
      .single();
    
    if (existingProfile) {
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
        throw updateError;
      }
    } else {
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
        throw insertError;
      }
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
