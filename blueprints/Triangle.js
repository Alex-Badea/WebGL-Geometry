class Triangle extends DrawableBlueprint {
	constructor(name, color, p1, p2, p3) {
		super(name, color);
		if (p1 == undefined || p2 == undefined || p3 == undefined)
			throw new Error("Undefined or null params");
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
	}
	
	instantiate(gl, programInfo) {
		if (gl == undefined || programInfo == undefined)
			throw new Error("Undefined or null params");
		return new TriangleInstance(this, gl, programInfo);
	}
	
	intersect(drawable, name, color) {
		if (name == undefined && color == undefined)
			[name, color] = [this.name + " ∩ " + drawable.name, vec3.fromValues((this.color[0]+drawable.color[0])/2, (this.color[1]+drawable.color[1])/2, (this.color[2]+drawable.color[2])/2)];
		if (drawable instanceof Segment)
			return this.triangleSegmentIntersect(drawable) != null ? new Point(name, color, this.triangleSegmentIntersect(drawable)) : null;
		else if (drawable instanceof Triangle)
			return this.triangleTriangleIntersect(drawable) != null ? new Segment(name, color,
				new Point("", vec3.fromValues(0,0,0), this.triangleTriangleIntersect(drawable)[0]),
				new Point("", vec3.fromValues(0,0,0), this.triangleTriangleIntersect(drawable)[1])) : null;
		else
			return drawable.intersect(this);
	}
	
	// Sursa: http://geomalgorithms.com/a06-_intersect-2.html
	triangleSegmentIntersect(segment) {
		const Pi = this.planeSegmentIntersect(segment);
		return this.contains(Pi) && segment.contains(Pi) ? Pi : null;
	}
	
	planeSegmentIntersect(segment) {
		const P0 = segment.p1.position;
		const P1 = segment.p2.position;
		const V0 = this.p2.position;
		const n = vec3.cross(vec3.create(), vec3.sub(vec3.create(), this.p1.position, this.p2.position),
							vec3.sub(vec3.create(), this.p3.position, this.p2.position));
		const num = vec3.dot(n, vec3.sub(vec3.create(), V0, P0));
		const den = vec3.dot(n, vec3.sub(vec3.create(), P1, P0));
		if (den === 0)
			throw Error("Parallel");
		const ri = num/den;
		return vec3.add(vec3.create(), P0, 
						vec3.scale(vec3.create(), vec3.sub(vec3.create(), P1, P0), ri));
	}
	
	contains(pointPos) {
		const Pi = pointPos;
		const V0 = this.p1.position;
		const V1 = this.p2.position;
		const V2 = this.p3.position;
		const u = vec3.sub(vec3.create(), V1, V0);
		const v = vec3.sub(vec3.create(), V2, V0);
		const w = vec3.sub(vec3.create(), Pi, V0);
		const num1 = vec3.dot(u, v)*vec3.dot(w, v) - vec3.dot(v, v)*vec3.dot(w, u);
		const num2 = vec3.dot(u, v)*vec3.dot(w, u) - vec3.dot(u, u)*vec3.dot(w, v);
		const den = vec3.dot(u, v)*vec3.dot(u, v) - vec3.dot(u, u)*vec3.dot(v, v);
		const s = num1/den;
		const t = num2/den;
		return s >= -0.0001 && t >= -0.0001 && s+t-1 <= 0.0001;
	}
	
	// Sursa: http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/code/tritri_isectline.txt
	triangleTriangleIntersect(triangle) {
		'use strict'
		const V0 = this.p1.position, V1 = this.p2.position, V2 = this.p3.position;
		const U0 = triangle.p1.position, U1 = triangle.p2.position, U2 = triangle.p3.position;
		let coplanar;
		let isectpt1 = vec3.create(), isectpt2 = vec3.create();
		
		let E1 = vec3.create(), E2 = vec3.create();
		let N1 = vec3.create(), N2 = vec3.create(), d1, d2;
		let du0, du1, du2, dv0, dv1, dv2;
		let D = vec3.create();
		let isect1 = [], isect2 = [];
		let isectpointA1 = vec3.create(), isectpointA2 = vec3.create();
		let isectpointB1 = vec3.create(), isectpointB2 = vec3.create();
		let du0du1, du0du2, dv0dv1, dv0dv2;
		let index;
		let vp0, vp1, vp2;
		let up0, up1, up2;
		let b, c, max;
		let tmp, diff = vec3.create();
		let smallest1, smallest2;
		
		// triangle 1
		vec3.sub(E1, V1, V0);
		vec3.sub(E2, V2, V0);
		vec3.cross(N1, E1, E2);
		d1 = -vec3.dot(N1, V0);
		
		du0 = vec3.dot(N1, U0) + d1;
		du1 = vec3.dot(N1, U1) + d1;
		du2 = vec3.dot(N1, U2) + d1;
		
		du0du1 = du0*du1;
		du0du2 = du0*du2;
		
		if (du0du1 > -0.0001 && du0du2 > -0.0001)
			return null;
		
		// triangle 2
		vec3.sub(E1, U1, U0);
		vec3.sub(E2, U2, U0);
		vec3.cross(N2, E1, E2);
		d2 = -vec3.dot(N2, U0);
		
		dv0 = vec3.dot(N2, V0) + d2;
		dv1 = vec3.dot(N2, V1) + d2;
		dv2 = vec3.dot(N2, V2) + d2;
		
		dv0dv1 = dv0*dv1;
		dv0dv2 = dv0*dv2;
		
		if (dv0dv1 > -0.0001 && dv0dv2 > -0.0001)
			return null;
		
		vec3.cross(D, N1, N2);
		
		max = Math.abs(D[0]);
		index = 0;
		b = Math.abs(D[1]);
		c = Math.abs(D[2]);
		if (b > max) {
			max = b;
			index = 1
		}
		if (c > max) {
			max = c;
			index = 2;
		} 
		
		vp0 = V0[index];
		vp1 = V1[index];
		vp2 = V2[index];
		
		up0 = U0[index];
		up1 = U1[index];
		up2 = U2[index];

		coplanar = compute_intervals_isectline(V0,V1,V2,vp0,vp1,vp2,dv0,dv1,dv2,dv0dv1,dv0dv2,/*out*/isect1,/*out*/isectpointA1,/*out*/isectpointA2);
		if (coplanar) return null;
		compute_intervals_isectline(U0,U1,U2,up0,up1,up2,du0,du1,du2,du0du1,du0du2,/*out*/isect2,/*out*/isectpointB1,/*out*/isectpointB2);
		
		// #define SORT2(a,b,smallest) if(a>b){float c;c=a;a=b;b=c;smallest=1;}else{smallest=0;}
		// SORT2(isect1[0],isect1[1],smallest1)
		if (isect1[0] > isect1[1]) {
			const c = isect1[0];
			isect1[0] = isect1[1];
			isect1[1] = c;
			smallest1 = 1;
		} else smallest1 = 0;
		// SORT2(isect2[0],isect2[1],smallest2)
		if (isect2[0] > isect2[1]) {
			const c = isect2[0];
			isect2[0] = isect2[1];
			isect2[1] = c;
			smallest2 = 1;
		} else smallest2 = 0;
		
		if (isect1[1] < isect2[0] || isect2[1] < isect1[0]) return null;
		
		// At this point, we know that the triangles intersect
		if (isect2[0] < isect1[0]) {
			if (smallest1 === 0) isectpt1 = isectpointA1;
			else isectpt1 = isectpointA2;
			
			if (isect2[1] < isect1[1]) {
				if (smallest2 === 0) isectpt2 = isectpointB2;
				else isectpt2 = isectpointB1;
			} else {
				if (smallest1 === 0) isectpt2 = isectpointA2;
				else isectpt2 = isectpointA1;
			}
		} else {
			if (smallest2 === 0) isectpt1 = isectpointB1;
			else isectpt1 = isectpointB2;
			
			if (isect2[1] > isect1[1]) {
				if (smallest1 === 0) isectpt2 = isectpointA2;
				else isectpt2 = isectpointA1;
			} else {
				if (smallest2 === 0) isectpt2 = isectpointB2;
				else isectpt2 = isectpointB1;
			}
		}
		return [vec3.fromValues(...isectpt1), vec3.fromValues(...isectpt2)];
	}
}

function compute_intervals_isectline(VERT0, VERT1, VERT2, VV0, VV1, VV2, D0, D1, D2, D0D1, D0D2, /*out*/isect, /*out*/isectpoint0, /*out*/isectpoint1) {
	if (D0D1 > -0.0001) isect2(VERT2,VERT0,VERT1,VV2,VV0,VV1,D2,D0,D1,isect,isectpoint0,isectpoint1);
	else if (D0D2 > -0,0001) isect2(VERT1,VERT0,VERT2,VV1,VV0,VV2,D1,D0,D2,isect,isectpoint0,isectpoint1);
	else if (D1*D2 > -0.0001 || Math.abs(D0) < 0.0001) isect2(VERT0,VERT1,VERT2,VV0,VV1,VV2,D0,D1,D2,isect,isectpoint0,isectpoint1);
	else if (Math.abs(D1) < 0.0001) isect2(VERT1,VERT0,VERT2,VV1,VV0,VV2,D1,D0,D2,isect,isectpoint0,isectpoint1); 
	else if (Math.abs(D2) < 0.0001) isect2(VERT2,VERT0,VERT1,VV2,VV0,VV1,D2,D0,D1,isect,isectpoint0,isectpoint1);
	else /*coplanar*/ return 1;
	return 0;
}

function isect2(VTX0, VTX1, VTX2, VV0, VV1, VV2, D0, D1, D2, isect, isectpoint0, isectpoint1) {
	let diff = vec3.create();
	let tmp = D0/(D0-D1);
	isect[0] = VV0+(VV1-VV0)*tmp;
	vec3.sub(diff, VTX1, VTX0);
	vec3.scale(diff, diff, tmp);
	vec3.add(isectpoint0, diff, VTX0);
	
	tmp = D0/(D0-D2);
	isect[1] = VV0+(VV2-VV0)*tmp;
	vec3.sub(diff, VTX2, VTX0);
	vec3.scale(diff, diff, VTX0);
	vec3.add(isectpoint1, VTX0, diff);
}