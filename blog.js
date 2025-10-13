const owner = "xunterr";
const repo = "blog";

async function getCommits() {
  let commits = [];
  let page = 1;

  while (true) {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=100&page=${page}`);
    const data = await res.json();
    if (!data.length) break;
    commits.push(...data);
    if (data.length < 100) {
      break;
    }
    page++;
  }

  return commits;
}

async function getFileTimes(commits) {
  const fileTimes = {};

  for (const commit of commits) {
    const sha = commit.sha;
    const date = commit.commit.author.date;

    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`);
    const commitData = await res.json();

    if (!commitData.files) continue;

    for (const f of commitData.files) {
      const filename = f.filename;
      if (!fileTimes[filename] || date > fileTimes[filename]) {
        fileTimes[filename] = date;
      }
    }
  }
  return fileTimes
}

const commits = await getCommits()
const fileTimes = await getFileTimes(commits)
const sortedFiles = Object.entries(fileTimes)
  .sort((a, b) => new Date(b[1]) - new Date(a[1]))
  .map(([filename, lastModified]) => ({
        filename,
        lastModified: new Date(lastModified).toISOString().slice(0, 10)
      }));


sortedFiles.forEach(({filename, lastModified}, i) => {
  let name = filename.slice(0, -3)

  let parent = document.getElementById("posts")

  let newDiv = document.createElement("div")

  let h2 = document.createElement("h2")
  h2.textContent = `${i+1} |`
  let a = document.createElement("a")
  a.textContent = `${name}`
  a.href = `post.html?p=${encodeURIComponent(filename)}`
  a.style = "margin-left: 1rem;"
  h2.appendChild(a)

  let date = document.createElement("span")
  date.textContent = lastModified
  date.className = "secondary-text"

  newDiv.appendChild(h2)
  newDiv.appendChild(date)
  parent.appendChild(newDiv)
});
