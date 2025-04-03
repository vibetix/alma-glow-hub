
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
    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing user:', checkError);
      return {
        success: false,
        message: `Error checking for existing user: ${checkError.message}`
      };
    }
      
    if (existingUser) {
      return {
        success: false,
        message: `User with email ${email} already exists`
      };
    }
    
    // Create new user with Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (authError) {
      throw authError;
    }

    if (!authData.user) {
      return {
        success: false,
        message: 'Failed to create user'
      };
    }

    // Update the user's role in the profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', authData.user.id);

    if (profileError) {
      throw profileError;
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
