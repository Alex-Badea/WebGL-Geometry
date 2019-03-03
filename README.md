# WebGL Geometry
This library was originally meant as an auxiliary to an educational project for teaching OpenGL. I figured it would prove useful for those who want to create geometric scenes for educational purposes in an easy way, straight in the browser, without the need for additional dependencies.

### Classes and methods
1. DrawableBlueprint: an abstract standalone primitive, not enclosed within a context, containing basic drawing information;
  1. constructor(**string** name: name under which the primitive will be displayed, **vec3** color: color of the primitive);

```diff
+ Can draw names of drawables
+ Supports shared drawable across multiple contexts
+ Easy screenshot utility (on key 'P')
+ Can modify drawable attributes at runtime
+ Can calculate and draw intersections between drawables
- Low memory footprint and high efficiency
```
