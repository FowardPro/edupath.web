mostly you don't need to download the app you can use it inside VSCode via the these steps


1.  Open Visual Studio.
2.  Go to File > Account Settings > Add an account.
3.  Choose GitHub and log in.

Then you will be able to pull and pull the data via the Terminal 
4. git clone https://github.com/Bee-Intelligence/Bee-FOMO-API.git
5. cd "C:\Users\Bee\OneDrive\Desktop\Bee Docs\Bee Corporations\Bee FNB\app-of-the-year"
Id CommandLine
  -- -----------
   6 git add .
   7 git commit -m "Initial commit with 2025 lesson structure"
   8 git remote add origin https://github.com/Bee-Intelligence/Bee-FOMO-API.git
   9 git branch -M kele
  10 git push -u origin kele
  11 git remote add origin https://github.com/BeeJonCee/App-Of-The-Year.git
  14 git push -u origin kele --force
  15 git pull origin kele --allow-unrelated-histories
  16 git push -u origin kele
  17 git push -u origin kele --force


git add .
git commit -m "Add lesson folders with .gitkeep placeholders"
git push origin kele