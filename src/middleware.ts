import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isMutationApiRoute = createRouteMatcher([
  "/api/projects",
  "/api/blogs",
  "/api/profile"
]);

export default clerkMiddleware(async (auth, request) => {
  const isMutation = ["POST", "PUT", "DELETE"].includes(request.method);

  if (isAdminRoute(request) || (isMutationApiRoute(request) && isMutation)) {
    const { userId } = await auth();
    if (!userId) {
      // For API routes, return a 401 instead of a redirect
      if (request.nextUrl.pathname.startsWith("/api")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      // Redirect to Clerk sign-in for page routes
      const signInUrl = new URL("/sign-in", request.url);
      return new Response(null, {
        status: 302,
        headers: { Location: signInUrl.toString() },
      });
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
