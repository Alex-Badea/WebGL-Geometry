class Segment extends DrawableBlueprint {
	constructor(name, color, p1, p2) {
		super(name, color);
		if (p1 == undefined || p2 == undefined)
			throw new Error("Undefined or null params");
		this.p1 = p1;
		this.p2 = p2;
	}
	
	instantiate(gl, programInfo) {
		if (gl == undefined || programInfo == undefined)
			throw new Error("Undefined or null params");
		return new SegmentInstance(this, gl, programInfo);
	}
		
	intersect(drawable, name, color) {
		if (name == undefined && color == undefined)
			[name, color] = [this.name + " ∩ " + drawable.name, vec3.fromValues((this.color[0]+drawable.color[0])/2, (this.color[1]+drawable.color[1])/2, (this.color[2]+drawable.color[2])/2)];
		if (drawable instanceof Segment)
			return this.segmentSegmentIntersect(drawable) != null ? new Point(name, color, this.segmentSegmentIntersect(drawable)) : null;
		else 
			return drawable.intersect(this);
	}
	
	// Sursa: https://math.stackexchange.com/q/271366
	segmentSegmentIntersect(segmeent) {
		let i1, i2;
		{
			const alpha = this, beta = segmeent;
			const C = alpha.p1.position, D = beta.p1.position;
			const e = vec3.sub(vec3.create(), alpha.p2.position, alpha.p1.position);
			const f = vec3.sub(vec3.create(), beta.p2.position, beta.p1.position);
			
			const g = vec3.sub(vec3.create(), D, C);
			const h = vec3.cross(vec3.create(), f, g);
			const k = vec3.cross(vec3.create(), f, e);
			const normh = Math.sqrt(vec3.dot(h, h));
			const normk = Math.sqrt(vec3.dot(k, k));
			if (normh/normk < -0.0001 || normh/normk > 1.0001)
				return null;
			const l = vec3.scale(vec3.create(), e, normh/normk);
			i1 = vec3.dot(h, k) > 0 ? vec3.add(vec3.create(), C, l) : vec3.sub(vec3.create(), C, l);
		}
		{
			const alpha = segmeent, beta = this;
			const C = alpha.p1.position, D = beta.p1.position;
			const e = vec3.sub(vec3.create(), alpha.p2.position, alpha.p1.position);
			const f = vec3.sub(vec3.create(), beta.p2.position, beta.p1.position);
			
			const g = vec3.sub(vec3.create(), D, C);
			const h = vec3.cross(vec3.create(), f, g);
			const k = vec3.cross(vec3.create(), f, e);
			const normh = Math.sqrt(vec3.dot(h, h));
			const normk = Math.sqrt(vec3.dot(k, k));
			if (normh/normk < -0.0001 || normh/normk > 1.0001)
				return null;
			const l = vec3.scale(vec3.create(), e, normh/normk);
			i2 = vec3.dot(h, k) > 0 ? vec3.add(vec3.create(), C, l) : vec3.sub(vec3.create(), C, l);
		}
		return i1.every((e,i) => Math.abs(e - i2[i]) < 0.0001) ? i1 : null;
	}
	
	contains(pointPos) {
		const P1 = this.p1.position;
		const P2 = this.p2.position;
		const M = pointPos;
		console.log(P1, P2, M)
		const P1M = vec3.sub(vec3.create(), M, P1);
		const P2M = vec3.sub(vec3.create(), M, P2);
		return vec3.dot(P1M, P2M) <= 0.0001;
	}
}