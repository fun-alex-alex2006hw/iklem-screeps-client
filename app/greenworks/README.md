# Greenworks

The greenworks library allow to use steam api inside an app (see [official repo](https://github.com/greenheartgames/greenworks) for more informations).

In this case, i've used greenworks to allow user to connect to server with Steam instead of having a email & password. But both exists so the choice is for the user using the client.

The most complicated part is already done, and this file is here if someone or some people decide to update it for all operating systems.

For now, greenworks work only on Linux but it's easy to make it works for Windows & Mac.

You'll need to download the [Steamwork SDK](https://partner.steamgames.com)

If you get this repo from my github profile, the version of greenworks i have here isn't up to date (go check the main Readme). You'll have to download the updated version of greenworks [here](https://github.com/greenheartgames/greenworks/releases) and maybe update Electron.

(From the official repo [here](https://github.com/greenheartgames/greenworks#general-usage-requirements) and modified for this client)  
If you have downloaded & updated you have to:  
1. First you'll need to copy `steam_api.dll (Windows)` / `libsteam_api.dylib (Mac)` / `libsteam_api.so (Linux)` in the `app/greenworks/lib`. You can find it in the `<steamSDK>/redistributable_bin/` folder
2. You'll need to copy `sdkencryptedappticket.dll (Windows)`/  `libsdkencryptedappticket.dylib (Mac)` / `libsdkencryptedappticket.so (Linux)` into `app/greenworks/lib` folder. You can find it in the `<steamSDK>/public/steam/lib/` folder

No need to create the `steam_appid.txt` since I've already done it. The ID used is the Steam Screeps game id. I don't know if it's allowed but i haven't got any response from the devs about using this id for this client.

And voila, now you can connect to any private server with Steam authentication !

The idea i can give you is to make 3 branches with there own steamworks libs with the names of "Linux", "Mac" & "Windows" because you can't have the 3 libraries in the same folder (and make the linux one the main one haha)

I don't think writing a "Remove Greenworks" part is necessary but if you don't want to use it, you can remove the `app/greenworks/` folder and find the calls inside the scripts OR comment the lines 158 & 159 from the `app/scripts/main.js` file.

IF you have any more question about this client, you can contact me on the Screeps Slack or on Github too (my name is iKlem for both) or the next maintainers. (I think you can check the package.json file to see the maintainers) (Note for next maintainers: don't forget to add contact to you instead of me since I'm not maintaining this anymore :3 )

---
Author of this readme: [iKlem](https://github.com/iKlem)
