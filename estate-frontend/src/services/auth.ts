import { supabase } from "../lib/supabaseClient";

//this function would create a toekn in the backend and send it in the link to the user email to reset the password
// export async function forgotPassword(email: string) {
//   const { data, error } = await supabase.auth.sendPasswordReset({
//     email
//   });
//     if (error) throw new Error(error.message);
//   return data;
// }


// this would check the token (which is in the link params) make sure it's valid, and update the user password with the new one
export async function ResetPassword(token: string, newPassword: string) {
  const { data, error } = await supabase.auth.resetPassword({
    token, 
    newPassword
  });
    if (error) throw new Error(error.message);
  return data;
}



export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw new Error(error.message);
  return data;
} 

export async function registerUser(fullName: string, email: string, password: string) {
  const { data, error} = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {full_name: fullName }
    }
  })

  if (error) throw new Error(error.message);
  return data;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}