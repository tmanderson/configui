# CONFIG-UI

Create JS property controls from HTML form controls.

![Example](https://github.com/tmanderson/configui/blob/master/assets/example.gif "Example")

Create all the controls you need (no need to create labels/value placeholders) and
ConfiGUI will handle the rest.

### The HTML
Use any valid HTML input types (including `color`)

#### Primary control group
```html
<div data-configui>
	...
</div>
```

#### Control Group
```html
<div data-configui>
	<div data-group="rotate">
		...
	</div>
</div>
```

#### Controls
```html
<div data-configui>
	<div data-group="rotate">
		<input type="range" name="x" value="0" min="-1.57" max="1.57" step="0.1" />
	</div>
</div>
```

### The JavaScript
Getters, setters, and listeners.

#### ConfiGUI([HTMLElement])
The element argument is optional (and if omitted, configui *will use the
first* `data-configui` element on the page)

```javascript
const cui = new ConfiGUI();
```

#### #get(key)
Get a value from control model.

```javascript
cui.get('rotate') // => { x: 0 }
cui.get('rotate.x') // => 0
```

#### #set(key, value)
Set a value (and update related UI).

```javascript
cui.set('rotate', { x: Math.PI })
cui.set('rotate.x', Math.PI)
```

#### #on(key, callback)
Listen to changes on the control model and execute supplied callback.

```javascript
  cui.on('rotate.x', function(value, htmlEvent) {
    console.log(value) // => 2.12
  })

  cui.on('rotate', function(value, htmlEvent) {
		console.log(value) // => { x: 2.12 }
  })
```
