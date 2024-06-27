const { execSync } = require("child_process");

function validateBranchName() {
  const branchName = execSync("git symbolic-ref --short HEAD")
    .toString()
    .trim();
  const regex =
    /^(feat|chore|refactor|fix|docs|init)\/RSS-PZ-\d{2,}_[a-zA-Z]*$/;

  if (!regex.test(branchName)) {
    // eslint-disable-next-line no-console
    console.error(
      `\nError: Invalid branch name "${branchName}". Branch names must follow the pattern "feat/RSS-PZ-01_implementLoginForm".\n`,
    );
    process.exit(1);
  }
}

validateBranchName();
