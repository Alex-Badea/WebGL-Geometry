# WebGL Geometry
This library was originally meant as an auxiliary to an educational project for teaching OpenGL. I figured it would prove useful for those who want to create geometric scenes for educational purposes in an easy way, straight in the browser, without the need for additional dependencies.

### Public classes and methods

- **DrawableBlueprint**: an abstract standalone primitive, not enclosed within a context, containing basic drawing information;
    - constructor(name[**string**]: name under which the primitive will be displayed, color[**vec3**]).
- **Point**[extends **DrawableBlueprint**];
    - constructor(name[**string**], color[**vec3**], position[**vec3**]).    
- **Segment**[extends **DrawableBlueprint**];
    - constructor(name[**string**], color[**vec3**], p1[**Point**]: head of segment, p2[**Point**]: tail of segment);
    - intersect(drawable[**DrawableBlueprint**], name*[**string**]: (optional) name of resulting drawable, color*[**vec3**]: (optional) color of resulting drawable).    
- **Arrow**[extends **Segment**]: a segment-like primitive but with an arrowhead on the tail;
- **Vector**[extends **Arrow**]: an arrow-like primitive but with the head always at origin;
    - constructor(name[**string**], color[**vec3**], p[**Point**]: tail of arrow);
- **Triangle**[extends **DrawableBlueprint**];
    - constructor(name[**string**], color[**vec3**], p1[**Point**], p2[**Point**], p3[**Point**]);
    - intersect(drawable[**DrawableBlueprint**], name*[**string**], color*[**vec3**]).   
- **CoordSystem**[extends **DrawableBlueprint**]: a container of primitives in which you can add other drawables (including other **CoordSystem**s);
    - constructor(name[**string**], color[**_array_**]{[**vec3**], [**vec3**], [**vec3**]}: colors of axes, modelMatrix[**mat4**]: homogenous transformation applied to each drawables inside this system in transpose form);
    - add(...[**DrawableBlueprint _varargs_**]).   
- **Scene**.
    - constructor(gl[**WebGLRenderingContext**]: the WebGL drawing context fetched from the _canvas_ element, options[**_object literal_**]{unlockRoll[**Boolean**]: is scene free to rotate around roll axis, depthTest[**Boolean**]});
    - insert(...[**DrawableBlueprint _varargs_**]);
    - render();
    - redraw(): deletes all primitives currently in scene, reinstantiates and redraws them (useful for async operations).
    
### Examples

There are also example scenes in the code, inside the _ex\_\*_ folders from which you can copy the _main.html_ and _main.js_ files into the main folder and open the html file in your browser for visualisation. The following are screenshots of the scenes: 

#### ex_spdc
Example of single primitive, multiple contexts: the cube-like model is drawn twice, once in the canonical coordinate system and once in a coordinate system with an arbitrary rotation, scaling and translation;
<a href="https://ibb.co/QX4x4Hd"><img src="https://i.ibb.co/JC9S9pQ/Scene-3.png" alt="Scene-3" border="0"></a>

#### ex_dynmodif
Example of runtime-modified attributes: input sliders have been used to vary the position of points S1 to S12;
<a href="https://ibb.co/HXG2gSw"><img src="https://i.ibb.co/ZNcJTj4/Scene.png" alt="Scene" border="0"></a>

#### ex_isect
Example of triangle-segment and triangle-triangle intersection;
<a href="https://ibb.co/crZfzNz"><img src="https://i.ibb.co/4VXvBjB/Scene-2.png" alt="Scene-2" border="0"></a>

#### ex_epipolar
A scene that loads .ply models and uses the features mentioned previously to render a more complex view.
<a href="https://ibb.co/b5TsB7y"><img src="https://i.ibb.co/Zz5B8Nw/Scene-1.png" alt="Scene-1" border="0"></a>
    
```diff
+ Can draw names of drawables
+ Supports shared drawable across multiple contexts
+ Easy screenshot utility (on key 'P')
+ Can modify drawable attributes at runtime
+ Can calculate and draw intersections between drawables
- Low memory footprint and high efficiency
```
