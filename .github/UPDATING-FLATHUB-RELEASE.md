# LibreLinkUpDesktop Flathub Update Guide

## Important

Before proceeding with the Flathub build manifest update, it is crucial to test the build and run it locally.

## Prerequisites

Ensure the following tools are installed on your system:
- Flatpak
- Flatpak Builder
- org.electronjs.Electron2.BaseApp//23.08
- org.freedesktop.Sdk.Extension.node20//23.08

Execute the following commands to install the necessary tools:

```bash
sudo apt install flatpak
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install -y flathub org.flatpak.Builder
flatpak install flathub org.electronjs.Electron2.BaseApp//23.08
flatpak install flathub org.freedesktop.Sdk.Extension.node20//23.08
sudo apt install flatpak-builder
```

## Process

1. **Clone the Repository:**   
  Clone the Flathub repository from  https://github.com/flathub/rocks.poopjournal.librelinkupdesktop 

2. **Update the Manifest:**   
   Modify the manifest file with the new tag and commit.

3. **Build and Install:**   
   Execute `flatpak-builder --user --install --force-clean build rocks.poopjournal.librelinkupdesktop.yml` to build and install the application.

4. **Run the Application:**   
   Launch the application using `flatpak run rocks.poopjournal.librelinkupdesktop`.

5. **Finalize the Update:**   
   If the application runs successfully, commit and push the changes to the repository for the new release.

## Updating Node Modules

If the node modules have been updated, follow these steps to update `generated-sources.json`.

### Prerequisites
- python 3.8
- pipx
- flatpak-node-generator

#### Setup

1. Clone the Flatpak Builder Tools repository from https://github.com/flatpak/flatpak-builder-tools.

2. Navigate to the `node` directory and install the tools using `pipx install .`. For more details, refer to the README at https://github.com/flatpak/flatpak-builder-tools/blob/master/node/README.md.

3. Ensure your PATH is correctly set up with `pipx ensurepath`.

### Process

1. **Clone the Source Repository:**   
   Clone the LibreLinkUpDesktop source repository from https://github.com/Crazy-Marvin/LibreLinkUpDesktop.

2. **Prepare the Directory:**   
   Ensure the `node_modules` folder does not exist in your clone of the repository.

3. **Generate Sources:**   
   Run `flatpak-node-generator npm package-lock.json` to generate the new sources.

4. **Update the Flathub Repository:**   
   Copy the updated `generated-sources.json` file to the Flathub repository.
