workflow "New workflow" {
  on = "push"
  resolves = ["new-action"]
}

action "GitHub Action for npm" {
  uses = "actions/npm@e7aaefed7c9f2e83d493ff810f17fa5ccd7ed437"
  runs = "npm i"
}

action "new-action" {
  uses = "owner/repo/path@ref"
  needs = ["GitHub Action for npm"]
}

workflow "New workflow 1" {
  on = "push"
}
