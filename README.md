# WebGL Geometry
This library was originally meant as an auxiliary to an educational project for teaching OpenGL. I figured it would prove useful for those who want to create geometric scenes for educational purposes in an easy way, straight in the browser, without the need for additional dependencies.

### Classes and methods
1. **DrawableBlueprint**: an abstract standalone primitive, not enclosed within a context, containing basic drawing information;
    - constructor(name[**string**]: name under which the primitive will be displayed, color[**vec3**]: color of the primitive).
  
2. Point[extends **DrawableBlueprint**];
    - constructor(name[**string**], color[**vec3**], position[**vec3**]: position in space of the point).
```diff
+ Can draw names of drawables
+ Supports shared drawable across multiple contexts
+ Easy screenshot utility (on key 'P')
+ Can modify drawable attributes at runtime
+ Can calculate and draw intersections between drawables
- Low memory footprint and high efficiency
```
