---
icon: osi
---

# How to contribute

Thanks for your interest in CREDEBL docs and for wanting to contribute! There are many ways how you can contribute and have an impact:

* **Contribute Code:** Submit a pull request to any of our product repositories to share your contributions and improvements.
* Report an Issue: Found something not working? Let us know by creating an issue in the relevant repository to help us improve.
* **Support the Community:** Brighten someone’s day by helping them resolve their challenges in LFDT [discord help channel](https://discord.com/channels/905194001349627914/1331657363161219082) for CREDEBL

You are encouraged to contribute to the repository by forking and submitting a pull request.

(If you are new to GitHub, you might start with a [basic tutorial](https://help.github.com/articles/set-up-git) and check out a more detailed guide to [pull requests](https://help.github.com/articles/using-pull-requests/).)

Pull requests will be evaluated by the repository guardians on a schedule and if deemed beneficial will be committed to the main branch. Pull requests should have a descriptive name and include a summary of all changes made in the pull request description.

If you would like to propose a significant change, please open an issue first to discuss the proposed changes with the community and to avoid re-work.

Contributions are made pursuant to the Developer's Certificate of Origin, available at [https://developercertificate.org](https://developercertificate.org), and licensed under the Apache License, version 2.0 (Apache-2.0).

### Contributing checklist:

* It is difficult to manage a release with too many changes.
  * We should release more often, not months apart.
  * We should focus on feature releases (minor and patch releases) to speed iteration.
* Mixing breaking changes with other PRs slows development.
  * Consider separating your PR into a (usually larger) non-breaking PR and a (usually smaller) breaking change PR.
* Commits and PR titles MUST follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). This allows us to automatically determine the next release version and generate changelog files.
  * Use conventional commits to mark breaking changes. Adding ! after the scope of a prefix message (e.g. chore!: a breaking change) or adding a BREAKING CHANGE: note to commit messages marks a commit as breaking. See [examples](https://www.conventionalcommits.org/en/v1.0.0/#examples)
* Signing off commit
  * We use developer certificate of origin (DCO) in all CREDEBL repositories, so to get your pull requests accepted, you must certify your commits by signing off on each commit.
  * $ git commit -s -m "your commit message"
  * To see if your commits have been signed off, run $ git log. Any commits including a line with Signed-off-by: Example Author \<author.email@example.com> are signed off.
  * If you need to re-sign the most current commit, use $ git commit --amend --no-edit -s.
  * The -s flag signs off the commit message with your name and email.

