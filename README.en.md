# Remote Map Card for Home Assistant

A custom Lovelace card for Home Assistant that lets you build an interactive remote control. Use your own image of a remote, or draw one directly in the card editor.

<p align="center">
  <a href="README.md">🇷🇺 Русский</a> · <a href="README.en.md">🇬🇧 English</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2026.11.1-blue" alt="Version">
  <img src="https://img.shields.io/badge/HACS-Custom%20Repository-41BDF5" alt="HACS">
  <img src="https://img.shields.io/github/license/alshevskij/lovelace-remote-map-card" alt="License">
  <img src="https://img.shields.io/github/stars/alshevskij/lovelace-remote-map-card?style=flat" alt="GitHub Stars">
</p>

<p align="center">
  <a href="https://my.home-assistant.io/redirect/hacs_repository/?owner=alshevskij&repository=lovelace-remote-map-card&category=plugin">
    <img src="https://my.home-assistant.io/badges/hacs_repository.svg" alt="Open Remote Map Card in HACS">
  </a>
</p>

## Features

- **Two design modes:**
  - **Designed remote** — a canvas with customizable buttons, shapes, colors, text, and icons.
  - **Image remote** — an image of your remote with interactive hotspots placed on top.
- Visual editor for adding, duplicating, deleting, moving, and configuring buttons.
- Adjustable button dimensions and hotspot sizes.
- Glass effect, blur, and glow in designed mode.
- Grid, grid snapping, and alignment guides for precise positioning.
- Home Assistant actions: perform an action/service, toggle an entity, open more-info, navigate, or open a URL.
- Optional hotspot visualization for debugging.
- Mouse, touchscreen, and keyboard support.

## Installation via HACS / Marketplace

### One-click installation (recommended)

Click the **Open HACS repository** badge above (in the README header). Home Assistant will open the repository in HACS or the Marketplace. If prompted, confirm adding the custom repository, then install Remote Map Card.

### Manual installation

1. Open **HACS** in Home Assistant.
2. Open the menu and select **Custom repositories**.
3. Add this repository:
   - URL: `https://github.com/alshevskij/lovelace-remote-map-card`
   - Category: **Dashboard** (called **Plugin** in older HACS interfaces).
4. Find **Remote Map Card** and install it.
5. Refresh your Home Assistant page.

If the resource was not added automatically (for example, if you manage dashboard resources manually through YAML), go to **Settings → Dashboards → Resources** and add a resource of type **JavaScript Module**:

`/hacsfiles/lovelace-remote-map-card/remote-map-card.js`

## Add the card

Open your dashboard editor, add a **Manual** card, and set its type:

```yaml
type: custom:remote-map-card
```

Alternatively, search for **Remote Map Card** in the card picker.

After adding the card, open its visual editor.

## Designed remote mode

In this mode, the card draws the background and buttons itself. Main options:

| Option | Description |
| --- | --- |
| `mode: designed` | Designed remote mode |
| `design.width` / `design.height` | Canvas dimensions in pixels |
| `design.background` | Background color |
| `design.radius` | Background corner radius |
| `glass` | Glass effect |
| `glow` | Glow when a button is pressed |
| `glass_opacity` | Glass background opacity, 10–100 |
| `glow_color` | Glow color |
| `grid.show` | Show the grid in the editor |
| `grid.snap` | Snap to the grid |
| `grid.guides` | Show alignment guides for the canvas and other buttons |
| `grid.size` | Grid spacing in pixels |

Button coordinates `x` and `y` are percentages of the canvas. Button dimensions `w` and `h` are in pixels. Circle and square buttons automatically use equal width and height.

### Example

```yaml
type: custom:remote-map-card
mode: designed
glass: true
glow: true
glass_opacity: 62
glow_color: "#60a5fa"
design:
  width: 436
  height: 781
  background: "#0a0c12"
  radius: 28
buttons:
  - name: Power
    x: 50
    y: 15
    shape: circle
    w: 90
    h: 90
    color: "#d65b5b"
    content: icon
    icon: power
    icon_scale: 70
    text_color: "#ffffff"
    hit_scale: 100
    tap_action:
      action: perform-action
      perform_action: light.toggle
      target:
        entity_id: light.living_room
```

Available shapes: `circle`, `oval`, `square`, `rect`, `rounded`, `pill`.

Button content:
- `text` — display text;
- `icon` — display a built-in icon;
- `none` — show only the button shape and color.

Built-in icons: `up`, `down`, `left`, `right`, `plus`, `minus`, `power`, `play`, `pause`, `stop`, `ffwd`, `rew`, `heart`, `home`, `back`, `menu`, `mute`.

The `hit_scale` option controls the hotspot size relative to the visible button, in percent.

## Image remote mode

In this mode, the image is used as the background and buttons are invisible interactive hotspots placed over it.

You can upload an image in the visual editor by dragging and dropping a file, selecting a file, or pasting an image from the clipboard. You can also provide an image path accessible to Home Assistant using the `image` option.

Button options:
- `x`, `y` — hotspot center position as percentages of the image width and height;
- `size` — hotspot diameter as a percentage of the image width;
- `name` — hotspot name and tooltip;
- `tap_action` — action to run when the hotspot is pressed;
- `entity` — entity used by the `toggle` and `more-info` actions.

Example:

```yaml
type: custom:remote-map-card
mode: image
image: /local/remote-control.png
buttons:
  - name: Power
    x: 50
    y: 12
    size: 9
    tap_action:
      action: perform-action
      perform_action: media_player.toggle
      target:
        entity_id: media_player.living_room_tv
```

## Tap actions

The card supports the following values for `tap_action.action`:

| Action | Behavior |
| --- | --- |
| `none` | Do nothing |
| `perform-action` | Run a Home Assistant action |
| `call-service` | Call a service (legacy-compatible format) |
| `toggle` | Toggle the specified entity |
| `more-info` | Open the entity's more-info dialog |
| `navigate` | Navigate to an internal Home Assistant path |
| `url` | Open a URL in a new tab |

For `toggle` and `more-info`, set the `entity` option on the button.

## Remote appearance example

<img width="406" height="663" alt="Remote Map Card example" src="https://github.com/user-attachments/assets/b7f6bbb2-82b1-4a5c-9a78-d580f4bf8411" />

## About this project

This card is primarily intended for emulating button presses on real infrared (IR) remote controls using smart IR hubs, for example hubs that work over MQTT (OpenBeken) or through the Tuya cloud.

In essence, it is an enhanced and extended version of Home Assistant's built-in Picture Elements card.

## Editing and troubleshooting

- Enable **Show hotspots on card (debug)** to display the active areas on the finished card.
- Drag buttons in the editor to reposition them.
- Use the blue handle to resize a button or hotspot.
- Double-click an empty area of the canvas to add a button.
- The editor warns when hotspots overlap. The topmost hotspot receives clicks in the overlapping area.
- In designed mode, you can enable the grid, snapping, and alignment guides. Arrow keys move the selected button; Shift increases the movement step, and Alt temporarily disables snapping while dragging.

## Feedback

Report bugs and suggest improvements in [Issues](https://github.com/alshevskij/lovelace-remote-map-card/issues).

## License

This project is distributed under the [MIT License](LICENSE).
