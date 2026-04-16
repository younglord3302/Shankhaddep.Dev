require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@insforge/sdk");

const client = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.INSFORGE_API_KEY || process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY
});

async function main() {
  const payload = {
      title: "Test Project",
      description: "Test description",
      tech_stack: ["Test"],
      github_url: "",
      live_url: "",
      featured: false,
      problem: "",
      solution: ""
  };
  const { data, error } = await client.database.from("projects").insert([payload]).select();
  console.log("Data:", data);
  console.log("Error:", error);
}
main();
