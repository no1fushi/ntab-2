// namespace
if (!("browser" in window)) {
  window.browser = chrome;
}

// Function definition
const onCreated = () => {
  if(browser.runtime.lastError) {
    console.warn(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

const outputTabs = tabs => {
  console.groupCollapsed("URLs")
  for(let tab of tabs) console.log(tab.url);
  console.groupEnd();
  console.groupCollapsed("IDs")
  for(let tab of tabs) console.log(tab.id);
  console.groupEnd();
}

const countNewtab = tabs => {

  let newtab = new Array();

  const firefox = "^about:newtab$";
  const chrome =  "^chrome:\/\/newtab\/$";
  const opera =  "^chrome:\/\/startpageshared\/$";
  const browsers = [chrome, firefox, opera];
  const regexp = new RegExp(browsers.join("|", "gm"))

  tabs.some((element, index) => {
    if(regexp.test(element.url)) newtab.push(index);
  })

  console.log("↓ newtab[]");
  console.log(newtab);
  return newtab;
}

const delTabs = (target, tabs) => {
  browser.tabs.remove(target, () => console.log("RemoveTabs"));
}

const createBm = (title, url, index) => {
  browser.bookmarks.create({
    title: title,
    url: url,
    parentId: index
  }, bookmarkItem => console.log("Bookmark added with ID: " + bookmarkItem.id));
}

const bmTabs = (target, tabs) => {
  chrome.bookmarks.getTree(bookmark => {

    const root = bookmark[0]["children"][1];
    const date = new Date();
    const parent = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const child = date.getHours() + "-" + date.getMinutes();

    console.log(root);
    console.log(child);

    browser.bookmarks.search(parent, contents => {
      if(contents.length === 0) {
        createBm(parent, null, root.id);
        console.log("Create " + parent);
        bmTabs(target, tabs);
      } else {
        for(let tab of tabs) {
          if(target.includes(tab.id) && tab.id != target[0]) {
            createBm(tab.title, tab.url, contents[0].id);
          }
        }
      }
    })
  })
}

// Create contextmenus
browser.contextMenus.create({
  id: "del",
  title: "delete Tabs",
  contexts: ["all"]
}, onCreated);

browser.contextMenus.create({
  id: "bm",
  title: "bookmark Tabs",
  contexts: ["all"]
}, onCreated);

browser.contextMenus.create({
  id: "bm-del",
  title: "bookmark and delete Tabs",
  contexts: ["all"]
}, onCreated);

browser.contextMenus.create({
  id: "separator",
  type: "separator",
  contexts: ["all"]
}, onCreated);

// Event listener
browser.contextMenus.onClicked.addListener((info, tab) => {
  browser.tabs.query({currentWindow: true}, tabs => {

    outputTabs(tabs);
    const newtab = countNewtab(tabs);
    console.log("Number of new tabs open :", newtab.length);

    if(newtab.length >= 2) {
      
      let target = new Array();
      for(let index in tabs) if(index >= newtab[0] && index < newtab[1]) target.push(tabs[index].id);
      console.log("↓ target[]");
      console.log(target);

      switch (info.menuItemId) {
        case "del":
        delTabs(target, tabs);
        break;
        case "bm":
        bmTabs(target, tabs);
        break;
        case "bm-del":
        bmTabs(target, tabs);
        delTabs(target, tabs);
        break;
      }

    } else {
      console.warn("There are less than 2 new tabs open");
    }

  });
});
