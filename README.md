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
