# CONFIG-UI

Create JS property controls from HTML form controls.

![Example](https://github.com/tmanderson/configui/blob/master/assets/example.gif "Example")


### The HTML
Use any valid HTML input types (including `color`)

```html
<div data-configui>
	<input type="range" min="0" max="10" step="10" name="speed" />
	<div data-group="rotation">
		<input name="x" min="3.15" max="3.15" step="0.01" />
		<input name="y" min="3.15" max="3.15" step="0.01" />
	</div>
</div>
```

### The JavaScript
Listen to properties, or defined groups of properties.

```javascript
  ConfiGUI.on('rotation.x', function(value, htmlEvent) {
    console.log(e);
  })

  ConfiGUI.on('fill', function(value, htmlEvent) {s
    console.log(color);
  })
```
