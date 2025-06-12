const form = document.getElementById('download-form');
const fileNameInput = document.getElementById('filename');

function getDate() {
  return new Date().toISOString().slice(0,10);
}

function getDefaultFileName() {
  return `tabdown_export_${getDate()}`
}

function downloadTextFile(data, extension) {
  const blob = new Blob([data], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileNameInput.value}.${extension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getMarkdownFrontmatter() {
  return `---
date: ${getDate()}
---
`
}

async function getTabsData() {
  const queryOptions = {};
  const tabs = await chrome.tabs.query(queryOptions);
  
  const tabsData = [];
  for (const tab of tabs) {
    console.debug(`Found tab ${tab.title}`);
    tabsData.push(tab);
  }
  return tabsData;
}

function tabToPlaintextLine(tab) {
  const {title, url} = tab;
  return `${title}: ${url}\n`;
}

function tabToMarkdownLine(tab) {
  const {title, url} = tab;
  return `- [${title}](${url})\n`
}

async function downloadTabsWithFormat(format) {
  console.log('Downloading tabs with format', format);

  const rowFormatter = format === 'markdown' ? tabToMarkdownLine : tabToPlaintextLine;
  let text = format === 'markdown' ? getMarkdownFrontmatter() : '';

  const tabsData = await getTabsData();

  for (const tab of tabsData) {
    text += rowFormatter(tab);
  }

  const extension = format === 'markdown' ? 'md' : 'txt';
  downloadTextFile(text, extension);
}

fileNameInput.value = getDefaultFileName();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const form = e.target;

  const checkedValue = [...form.elements]
    .filter((input) => input.checked)
    .map((input) => input.value)[0];

  console.log('Tabdown');
  downloadTabsWithFormat(checkedValue)
    .then(() => {
      console.log('Done');
    });
});

