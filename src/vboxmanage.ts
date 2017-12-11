import { exec } from "child_process";

const MATCH_VM_REGEXP = /^"([^"]+)"\s{([0-9a-fA-F\-]+)}$/;
const VBOXMANAGE_BINARY = "vboxmanage";

function getRunTemplateFromOsType(osType: string) {
  if (osType.startsWith("Windows")) {
    return "cmd.exe";
  }

  if (osType.startsWith("MacOS")) {
    return "/usr/bin/open -a";
  }

  return "/bin/sh";
}

function matchVm(line: string) {
  const matching = line.match(MATCH_VM_REGEXP);
  if (matching) {
    return { name: matching[1], uuid: matching[2] };
  }
  return null;
}

export async function vboxmanage(
  name: string,
  ...args: string[]
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(
      `${VBOXMANAGE_BINARY} -q ${name} ${args.join(" ")}`,
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve(stdout.trim());
      },
    );
  });
}

export async function startvm(vm: string) {
  return vboxmanage("startvm", `"${vm}"`, "--type gui");
}

export async function showvminfo(vm: string) {
  return (await vboxmanage("showvminfo", `"${vm}"`, "--machinereadable"))
    .split("\n")
    .reduce(
      (info, line) => {
        const [key, value] = line
          .split("=")
          .map(s => s.replace(/^"(.*)"$/, "$1"));
        info[key] = value;
        return info;
      },
      {} as { [key: string]: string },
    );
}

export async function guestcontrol(
  vm: string,
  username: string,
  password: string,
  command: string,
  ...args: string[]
) {
  return vboxmanage(
    "guestcontrol",
    `"${vm}"`,
    `--username '${username}'`,
    `--password '${password}'`,
    command,
    ...args,
  );
}

export async function guestcontrolStart(
  vm: string,
  username: string,
  password: string,
  command: string,
) {
  const osType = (await showvminfo(vm)).GuestOSType;
  const runTemplate = getRunTemplateFromOsType(osType);
  return guestcontrol(
    vm,
    username,
    password,
    "start",
    `${runTemplate} -- "/c" ${command}`,
  );
}

export async function list() {
  return (await vboxmanage("list vms"))
    .split("\n")
    .map(matchVm)
    .filter(vm => vm != null) as Array<{ name: string; uuid: string }>;
}

export async function controlvm(
  vm: string,
  command: string,
  ...args: string[]
) {
  return vboxmanage("controlvm", `"${vm}"`, command, ...args);
}

export async function acpipowerbutton(vm: string) {
  return controlvm(vm, "acpipowerbutton");
}
