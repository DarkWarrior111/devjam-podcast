
# Devjam Podcast

This project was made as a part of [Devjam](https://devjam.org).

# Demo

### [Live Demo](https://devjam-podcast.netlify.app)

![Screenshot](https://i.imgur.com/WzmFk7L.png)

## Features

1.  ### Search for podcasts.
    
    You can search for podcast using title, owner or author.  
    Additionally, you can also search for podcast using categories by clicking on  on the left of the search bar. This enables category search mode and you can search using the categories. Separate categories by a space and use hyphen( - ) before a category to exclude it from the search results.  
    Eg: food -news gives results which contain food category and any result containing news category is excluded
    
2.  ### View podcast information.
    
    You can see more information about the podcast by clicking on the title of the podcast
    
3.  ### Listen to podcasts.
    
    You can listen to podcasts by clicking on the thumbnail of the episode. You can also queue podcasts by clicking on plus icon (  ) in the episode information.  
    You can listen to all the episodes of a podcast by clicking on play all and selecting the order to play the episodes in.
    
4.  ### Add podcasts to favorite.
    
    You can add podcasts and remove them from favorites by clicking on the heart icon in the podcast title.


## Podcast Player

When a user first plays a podcast, a player is shown at the bottom of the screen.  
The player is used to control the playback of the podcast. You can play/pause the podcast, seek, go forwards/backwards by 5 seconds, adjust the volume of the podcast, play next/previous podcast and see the queue.  
Progress and playlist are saved locally so the user can pick off where they left off.  
The player also supports some shortcut keys:

| Shortcut key | Action |
|-|-|
|Space |Play/Pause|
|Ctrl + ➡ | Go forward by 5 seconds |
|Ctrl + ⬅ | Go backward by 5 seconds |
|Ctrl + ⬆ | Increase volume by 10% |
|Ctrl + ⬇ | Decrease volume by 10% |
|m | Mute/Unmute |
|n | Play next podcast |
| p | Play previous podcast |

# Dependencies

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-icons](https://react-icons.github.io/react-icons/)
- [react-query](https://react-query.tanstack.com/)

# Installation and running

Clone git repo

```
git clone https://github.com/DarkWarrior111/devjam-podcast.git
```

Install dependencies

```
npm install

```

Run

```
npm run dev

```

Build

```
npm run build

```
