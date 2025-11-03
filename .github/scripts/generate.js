const fs = require("fs");
const axios = require("axios");

const username = "jimmy0904229-collab";
const repo = "devops-pages-lab";

async function main() {
  const readme = fs.readFileSync("README.md", "utf8");

  const { data: events } = await axios.get(`https://api.github.com/users/${username}/events/public`);
  const activities = events
    .slice(0, 5)
    .map(e => `- ${e.type} → [${e.repo.name}](https://github.com/${e.repo.name})`)
    .join("\n");

  const { data: commits } = await axios.get(`https://api.github.com/repos/${username}/${repo}/commits`);
  const commitTable =
    "| SHA | Message | Date |\n|------|----------|------|\n" +
    commits
      .slice(0, 5)
      .map(c => `| [${c.sha.substring(0,7)}](${c.html_url}) | ${c.commit.message} | ${c.commit.author.date.split('T')[0]} |`)
      .join("\n");

  const newReadme = readme
    .replace(/<!--START_ACTIVITY-->[\s\S]*<!--END_ACTIVITY-->/, `<!--START_ACTIVITY-->\n${activities}\n<!--END_ACTIVITY-->`)
    .replace(/<!--START_COMMITS-->[\s\S]*<!--END_COMMITS-->/, `<!--START_COMMITS-->\n${commitTable}\n<!--END_COMMITS-->`);


  fs.writeFileSync("README.md", newReadme);
}

main();
