Loom! (v2)
==========
![Loom Header](/readme_images/loom_logo.jpg)

What if Twine stories could be multiplayer?

Loom is a very simple platform that serves mutant multiplayer twines.
We inject some extra code into the story, and the server keeps track of reader presense as users navigate the story tree.

In its most mature form: 
Story authors can watch readers pass through their stories, and interact with them. Readers can see others they encounter as they pass through stories together, and interact with them. Readers can create and cultivate an avatar within a story. Authors can enable a wide range of interactions for readers to explore- 'pokes', chat, story specific actions like trade and combat, even video chat. Story access can be as wide or as limited as an author desires. Authors can connect stories together, and create event emittors to connect third party services to the story activity. All this on top of the existing richness of Twine as a platform for creativity. 

This is a re-write of [this project](https://github.com/pgulley/loom) using node.js as the backend instead of python. The first implimentation was a hack designed on the fly to facilitate warps- a creative response to socializing under lockdown. Much of the above was already functionally implimented in version one, but the expanding scope of the project demanded a better stack and cleaner development approach. So we're starting from scratch! 

### What's it for??
Unique interactive online art. Next-level roleplay infrastructure. Structured Online Gatherings for parties, business, just hanging out. 

### Deployment, Use
It's a simple node app, and I intend to keep it open source for as long as possible. That being said, right now I don't intend to support private deployments in any capacity. It should be simple enough to deploy on your own if you want to try, but right now I'm not developing this with that case in mind.
When this version reaches an MVP (I'll know it when I see it...), I'll deploy a small test instance that I'll make public here and on other forums. In the meantime, loom v1 is still deployed [here](https://twine-loom-test.herokuapp.com), and you can play around with it to your hearts content.

### Status 
As of right now, the core logic responsible for tracking clients within twines is rewritten and functional.
I'm in the process of a several day sprint to get user profiles and admin panels up and running. 
I'll have to follow up with a few implimentations of user presense and a general polish/shakedown. MVP will be around then. Expect mid-august. 

I'm going to be implimenting avatars using [this repository](https://github.com/pgulley/svg_wiggles) once all the behind-the-scenes stuff is happy.

Much of the more exciting parts of the pitch (trade, combat, etc) rely on a deeper integration with the Twine engine itself- and that hasn't neseccarily been demonstrated yet. It may turn out to lie outside of the scope of this particular development push. If so, that's ok- it's still a compelling enough without it- But my hopes remain high that I'll figure something out.



