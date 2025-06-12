
function getDate() {
  return new Date().toISOString().slice(0,10);
}

function downloadDataAsTextFile(data) {
  const blob = new Blob([data], {type: 'application/text'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tabdown_export_${getDate()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function getTabsAsMdString() {
  let queryOptions = {};

  let tabs = await chrome.tabs.query(queryOptions);
  data = `---
date: ${getDate()}
---
`
  for (const tab of tabs) {
    const {title, url} = tab;
    const mdLink = `[${title}](${url})`;
    data += `- ${mdLink}\n`;
    console.log(`Found tab ${mdLink}`);
  }
  return data;
}

console.log('Tabdown');
getTabsAsMdString().then((data) => {
  downloadDataAsTextFile(data);
  console.log('done');
});
