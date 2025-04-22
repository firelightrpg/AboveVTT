# AboveVTT-unofficial-fiveten-audio

This is an **unofficial fork** of the AboveVTT project with two primary enhancements:

1. **Best-path measurement with grid snapping (5–10 diagonal approximation).**  
   Movement measurements now use a "best path" calculation by default, following the 5–10 diagonal rule, and the measurement line **snaps visually to the grid** to reflect this path.  
   This provides clean, table-friendly representations of movement, similar to in-person, grid-miniature play.  
   The "right-click to add a waypoint" feature is still fully supported if you wish to manually control the path (e.g., to avoid opportunity attacks, difficult terrain or other obstructions).

2. **DM-only WebSocket server for external audio control.**  
   This fork opens a WebSocket connection **only for the DM**, signaling when the combat tracker is opened or closed.  
   This allows external tools (such as music controllers or streaming setups) to react to combat state — for example, automatically selecting or transitioning music on Twitch streams.

> This fork is not affiliated with the original AboveVTT project.


---

## About the Original Project

AboveVTT integrates a virtual tabletop directly into your D&D Beyond campaign.

> _I (Daniele "cyruzzo" Martini) started AboveVTT as a hobby project. The initial target was just to have shared maps and tokens,  
> but then things got out of hand. As this was just a way to "hack" inside D&D Beyond, I took every possible bad shortcut and ignored any best practice.  
> The goal was (and still is) to reach features quickly._

---

## Contributing

Considerations from the original project (still valuable guidance):

- Right now AboveVTT has people running games with it, so the most important rule for any PR is *we try our best not to break things*.
- Every PR *MUST* support basic compatibility with the previous versions of AboveVTT.
- Don’t reformat the pieces you are not editing. It makes the PR hard to read, and you risk causing conflicts with other people’s work.
- Join the Discord server and *talk with the maintainers* about what you are working on.
- When you send a pull request from one of your branches, don’t add more features to that until it’s merged (only bugfixes).
- Try to keep different features in separate branches so they can be imported individually.
- Be nice to other devs.

---

## License

This project remains under the original license:

> Copyright (c) 2021 Daniele Martini  
> This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, version 3 of the License.

This program is distributed in the hope that it will be useful,  
but WITHOUT ANY WARRANTY; without even the implied warranty of  
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the  
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along with this program.  
If not, see <https://www.gnu.org/licenses/>.

