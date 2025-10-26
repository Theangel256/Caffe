export async function GET(context) {
  await context.session?.destroy();
  return context.redirect('/');
}