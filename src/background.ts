function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();


const createCorsHeaders = (host: string): chrome.declarativeNetRequest.ModifyHeaderInfo[] => [
  {
    header: 'Access-Control-Allow-Origin',
    operation: chrome.declarativeNetRequest.HeaderOperation.SET,
    value: host,
  },
  {
    header: 'Access-Control-Allow-Credentials',
    operation: chrome.declarativeNetRequest.HeaderOperation.SET,
    value: 'true',
  },
  {
    header: 'Access-Control-Allow-Methods',
    operation: chrome.declarativeNetRequest.HeaderOperation.SET,
    value: 'GET, PUT, DELETE, POST, OPTIONS',
  },
  {
    header: 'Access-Control-Allow-Methods',
    operation: chrome.declarativeNetRequest.HeaderOperation.SET,
    value: 'GET, PUT, DELETE, POST, OPTIONS',
  },
];

const createUpdateRulesOption = async (
  modifyDomains: any[],
): Promise<chrome.declarativeNetRequest.UpdateRuleOptions> => {
  const currentDomains = await chrome.declarativeNetRequest.getDynamicRules();
  console.log(currentDomains);
  const removeRuleIds = currentDomains.map((cd) => cd.id);
  const addRules = modifyDomains.map((md, idx) => ({
    priority: 1,
    id: idx + 1,
    condition: {
      domains: [md.domain],
      resourceTypes: [
        chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
        chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
      ],
    },
    action: {
      type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
      responseHeaders: createCorsHeaders(md.domainWithProtocol),
    },
  }));
  return {
    removeRuleIds,
    addRules,
  };
};
let id = 900
chrome.tabs.onCreated.addListener(
  async () => {
    // const updateRulesOption = await createUpdateRulesOption([]);
    // await chrome.declarativeNetRequest.updateDynamicRules(updateRulesOption);
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        {
          priority: 1,
          id: id++,
          condition: {
            urlFilter: 'google.com',
            resourceTypes: [
              chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
              chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
              chrome.declarativeNetRequest.ResourceType.STYLESHEET,
              chrome.declarativeNetRequest.ResourceType.SCRIPT,
              chrome.declarativeNetRequest.ResourceType.SCRIPT,
              chrome.declarativeNetRequest.ResourceType.IMAGE,
              chrome.declarativeNetRequest.ResourceType.FONT,
              chrome.declarativeNetRequest.ResourceType.OBJECT,
              chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
              chrome.declarativeNetRequest.ResourceType.PING,
              chrome.declarativeNetRequest.ResourceType.CSP_REPORT,
              chrome.declarativeNetRequest.ResourceType.MEDIA,
              chrome.declarativeNetRequest.ResourceType.WEBSOCKET,
              chrome.declarativeNetRequest.ResourceType.OTHER,
            ],
          },
          action: {
            type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
            responseHeaders: createCorsHeaders('*'),
            requestHeaders: [
              {
                header: 'Origin',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value: "https://my-website.com",
              },
              {
                header: 'Referer',
                operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                value: "https://wjksdfhjnsdjknfsdjnfsdjnkfjsdnjsdffdsmy-website.com",
              },
            ]
          },
        },
      ]
    });

    const currentDomains = await chrome.declarativeNetRequest.getDynamicRules();
    console.log("CURRRR", currentDomains);

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        // query the active tab, which will be only one tab
        //and inject the script in it
        console.log(tabs[0].id);


        chrome.scripting.executeScript({
          target: {
            tabId: tabs[0].id as number,
          },
         func: () => {fetch("https://www.google.com/").catch(err => console.log(err))},
        });
      });
  }
)

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(
  (info) => {
    console.log("INFO MATCHED", info);
  }
)