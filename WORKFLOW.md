# Workflow

**Notice:** The workflow md-file is used by SigtunaGIS and is **NOT** a part of the general Origo project.

## 1. About

This document contains information on how to work with GIT and what type of paradigm to use in the SigtunaGIS repos. 
To to able to work with the workflow fully you should know the fundamentals of GIT and Github and the basic syntax of GIT.

## 2. Introduction

The following workflow is strongly inspired by Vincent Driessen's orginal blog post  on [A successful Git branching model](https://nvie.com/posts/a-successful-git-branching-model/) and [the github-flow paradigm](https://guides.github.com/introduction/flow/). 

The workflow is not dependent of any extensions.

## 3. Branches:

### 3.1 The main branches:

Instead of a single master branch, this workflow uses two branches to record the history of the project with an infinite lifetime.

* **Master =** Stores the official release history

* **Develop =** Serves as an integration branch for features. It's also convenient to tag all commits in the master branch with a version number.


### 3.2 Supporting branches:

These branches have a specific purpose and are bound to strict rules as to which branches may be their originating branch and which branches must be their merge targets.
They're categorized by how we use them. 

**Types of branches we may use are:**

* **Feature branches =** Are used to develop new features for the upcoming or a distant future release. feature branches use develop as their parent branch. When a feature is complete, it gets merged back into develop. Features should never interact directly with master.
* **May branch off from:** Develop
* **Must merge back into:** Develop
* **Branch naming convention:** Anything except master, develop, release-*, or hotfix-* . Your branch name should be descriptive (e.g., refactor-authentication, user-content-cache-key, make-retina-avatars), so that others can see what is being worked on.
  * **How to create:**
    git checkout develop
    git checkout -b feature_branch
  * **How to finish:**
    git checkout develop
    git merge feature_branch

* **Release branches =** Are used for preparation of a new production release like minor bug fixes, preparing metadata etc.
  *  **May branch off from:** Develop
  * **Must merge back into:** Develop and master
  * **Branch naming convention:** release-* . The branch name should also include version number (1.0.0, 1.1.2 etc ) or built dates (2020-04-01).
  * **How to create:**
    git checkout develop
    git merge feature_branch
  * **How to finish:**
    git checkout develop
    git checkout -b release/0.1.0
  
They allow for last-minute dotting of i’s and crossing t’s. Furthermore, they allow for minor bug fixes and preparing meta-data for a release (version number, build dates, etc.). By doing all of this work on a release branch, the develop branch is cleared to receive features for the next big release.

* **Hotfix branches aka Maintenance branches=** Are used to solving bugs in a production build. Hotfix branches are a lot like release branches and feature branches except they're based on master instead of develop. This is the only branch that should fork directly off of master. Having a dedicated line of development for bug fixes lets your team address issues without interrupting the rest of the workflow or waiting for the next release cycle. You can think of maintenance branches as ad hoc release branches that work directly with master.

* **May branch off from:** master
* **Must merge back into:** develop and master
* **Branch naming convention:** hotfix-* . Your branch name should be descriptive and explain the issue (e.g., wms-layer-not-showing, exception-thrown-on-login) so that     others can see what is being worked on/fixed.
 * **How to create:**
  git checkout master
  git checkout -b hotfix_branch
  * **How to finish:**
  git checkout master
  git merge hotfix_branch
  git checkout develop
  git merge hotfix_branch
  git branch -D hotfix_branch

## 4.Testing and deployment

Before merging a branch into the parent branch it must **always** be tested, to minimize the risk for potential/future issues.
Preferably when a branch is done a [Code Review/Peer Code Review](https://smartbear.com/learn/code-review/what-is-code-review/) should be done.











