import * as vboxmanage from './vboxmanage';

interface IBrowserProviderPluginHost {
  reportWarning(browserId: string, ...args: any[]): void;
}

const IE_PATH = "C:\\Program Files\\Internet Explorer\\iexplore.exe";
const SERVICE_NOT_READY_YET_MESSAGE =
  "VBoxManage: error: The guest execution service is not ready (yet)";
const SYSTEM_IN_INVALID_STATE_MESSAGE = "VBOX_E_INVALID_OBJECT_STATE";

const runningBrowsers: string[] = [];
const runningTestIds: { [key: string]: string } = {};

async function sleep(ms: number): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

async function startBrowser(browserName: string, pageUrl: string) {
  return vboxmanage.guestcontrolStart(
    browserName,
    "IEUser",
    "Passw0rd!",
    `"${IE_PATH}" "${pageUrl}"`,
  );
}

async function retryStartBrowser(
  browserName: string,
  pageUrl: string,
  attempts: number,
): Promise<string> {
  try {
    return await startBrowser(browserName, pageUrl);
  } catch (error) {
    if (attempts > 0 && error.message.includes(SERVICE_NOT_READY_YET_MESSAGE)) {
      await sleep(5 * 1000);
      return retryStartBrowser(browserName, pageUrl, attempts - 1);
    }
    throw error;
  }
}

export const isMultiBrowser = true;

export async function openBrowser(
  this: IBrowserProviderPluginHost,
  id: string,
  pageUrl: string,
  browserName: string,
) {
  try {
    await vboxmanage.startvm(browserName);
    runningBrowsers.push(browserName);
    await sleep(10 * 1000);
  } catch (e) {
    const error: Error = e;
    if (!error.message.includes(SYSTEM_IN_INVALID_STATE_MESSAGE)) {
      throw error;
    }
  }
  return retryStartBrowser(browserName, pageUrl, 5);
}

export async function getBrowserList() {
  return (await vboxmanage.list()).map(({ name }) => name).sort();
}

export async function dispose() {
  runningBrowsers.forEach(browser => vboxmanage.acpipowerbutton(browser));
}
