# About the Interface



# Simple Installation Guide

> [!WARNING]
> **A Note on Security:** This code was generated with the full assistance of AI. While I guarantee that I haven't intentionally included anything malicious, you should always review and audit the code yourself before running it. Ultimately, the security of your account and data is your responsibility—give it a look over!

1.  **Google Drive Setup**
    * Create **one main folder** to house your project.
    * Inside that folder, create **three sub-folders** named:
        * `Speech`
        * `Notes`
        * `Feedback`
    > **Note:** You can name these whatever you like, as long as they are identifiable to you.

2.  **Spreadsheet**
    * Create a new **Google Sheet** anywhere you like, but I recommend placing it inside the main folder.
    * Select all cells (`Cmd + A` or `Ctrl + A`).
    * Go to **Format** > **Wrapping** > **Wrap**.
    * Go to **Format** > **Alignment** > **Top**.

3.  **Apps Script Integration**
    * Click the **Extensions** menu at the top of your sheet.
    * Select **Apps Script**.
    * In the `Code.gs` file, delete any existing code and **paste the script in this GitHub**.
    * Save the project (`Cmd + S` or `Ctrl + S`).

4.  **Interface Setup**
    * Click the **+ (plus)** button next to "Files" and select **HTML**.
    * Name the file `index.html`.
    * Paste the HTML code in this GitHub into this file and **click save again**.

5.  **Permissions**
    * **Reload** your Google Sheet. You will see a new **Recorder** button on the top menu.
    * Click **Recorder** > **Open Recorder**.
    * An authorization prompt will appear. Follow these steps:
        * Click **Okay** → **Advanced** → **Go to [Project Name] (Unsafe)**.
        * Click **Select All** and **Continue**.

6.  **Final Steps**
    * Complete the initial setup by selecting the folders you created in Step 1.
    * **Success!** You are now ready to use your new logger.

# Phone Installation

Follow these steps to link your Google Sheet with an AppSheet mobile interface:

### 1. AppSheet Creation
* In your Google Sheet, go to **Extensions** > **AppSheet** > **Create an App**.
* Select **Continue** and then **Allow** to grant necessary permissions.

### 2. Data Configuration
* Click the **Data icon** (left sidebar).
* Locate your main table and adjust the following:
    * **Unselect** `Speech Code` as the Key and Label.
    * **Select** `_RowNumber` as the **Key**.
    * **Select** `Motion` as the **Label**.
* **Update Column Types**:
    * Change `Recording`, `Feedback`, and `Notes` to **URL**.
    * Change `Motion` to **Long Text**.

### 3. View Configuration
* Hover over the **Phone icon** (left sidebar) and click **Views**.
* Scroll to **View Options** and configure:
    * **Sort By**: `_RowNumber` (Set to **Descending**).
    * **Group By**: Click **Add** and select `Style` (Set to **Descending**).

### 4. Action Setup
* Click the **Lightning Bolt icon** (Actions) on the left.
* **Hide Default Action**: Locate the "Add" action and change its **Position** to **Hide**.
* **Create Custom Launcher**:
    * Click **Create a new action** and name it `Open Logger`.
    * Set **Do This** to: `External: go to a website`.

### 5. Web App Deployment
* Return to your **Google Sheet** > **Extensions** > **Apps Script**.
* Click **Deploy** > **New Deployment**.
* Click the **Settings Cog** next to "Select type" and choose **Web App**.
* Set **Who has access** to **"Only myself"** (crucial for security).
* Click **Deploy** and **Copy** the provided Web App URL.

### 6. Linking the Interface
* Go back to **AppSheet**.
* In the **Target** field of your `Open Logger` action, paste the link inside **quotation marks - highly important**.
    * *Example:* `"https://script.google.com/macros/s/.../exec"`
* **Save** your changes.

> [!NOTE]
> **Important:** Every time you modify the script code, you must create a **New Deployment** and update the link in the AppSheet Target section.

### 7. Install
* In the same action, set **Position** to **Primary**.
* (Optional) Under the **Display** section, choose a custom icon for your button.
* Click the **Save icon** at the top right of AppSheet.
* **On your Phone**:
    1. Install the **AppSheet app** from the App Store or Play Store.
    2. Open it and find your app under the **"Owned by me"** section.
    3. If you want, tap the **Three Lines (Menu)** > **Add Shortcut** to add the app to your Home Screen.

# Adding Features You Want

If you want to add new features but aren't a coding expert, **Gemini** or any other AI is your best friend! To get the best results without breaking your project, keep these tips in mind:

* **Use the Canvas Setting:** I highly recommend using the **Canvas** or side-by-side editing feature in the AI interface. It makes it much easier to see exactly what code is being added or changed in real-time.
* **Protect Your Existing Code:** When asking for updates, specifically prompt the AI to **"not change any existing features"** or "only add the new functionality without modifying the current logic."
* **Editing Both `Code.gs` and `index.html`:** Make sure you prompt the robot to edit both files if needed. If you don't, some of your changes might not work, as the two files do different things.
* **Small Updates:** Add features one at a time. It’s much easier to troubleshoot a single new button than a complete rewrite of the script.
* **Double-Checking:** Since AI can sometimes be a bit "creative" (and potentially devious with code blocks), always do a quick scan of the new code before pasting it back into your `Code.gs` or `index.html`.

---

> [!IMPORTANT]  
> **Reminder:** Always keep a backup of your working code in a separate text file before letting an AI suggest major changes!

**Enjoy your new logger!**
