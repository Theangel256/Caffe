export async function GET({ cookies, redirect }) {
  cookies.delete('session_data', { path: '/' });
  return redirect('/');
}