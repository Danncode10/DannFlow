import { createClient } from '@/utils/supabase/server';

export async function getVibeCheckData() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(3);
      
    if (error) {
      console.warn("Vibe Check Error. Check your tables:", error.message);
      return [];
    }
    
    return data || [];
  } catch (err) {
    return [];
  }
}

export async function getUserSession() {
  try {
     const supabase = await createClient();
     const { data: { user }, error } = await supabase.auth.getUser();
     if (error) return null;
     return user;
  } catch (err) {
    return null;
  }
}
export async function getGithubRepos() {
  // Normally this would be a fetch to GitHub API
  // For this template, we are simulating the data found via GitHub MCP
  return [
    { name: "Danncode10", url: "https://github.com/Danncode10/Danncode10", description: "Personal Profile" },
    { name: "Learn-Python", url: "https://github.com/Danncode10/Learn-Python", description: "Python Learning Track" },
    { name: "Github-Practice", url: "https://github.com/Danncode10/Github-Practice", description: "Git Workflow Practice" },
    { name: "Essential-Electrical-Components-for-CS-Robotics", url: "https://github.com/Danncode10/Essential-Electrical-Components-for-CS-Robotics", description: "Robotics Fundamentals" },
    { name: "Codeforces-Answers", url: "https://github.com/Danncode10/Codeforces-Answers", description: "Competitive Programming Solutions" }
  ];
}
